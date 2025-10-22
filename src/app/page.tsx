"use client";

import React, { useEffect, useState } from "react";
import { DashboardHeader } from "./components/DashboardHeader";
import { OverviewCard } from "./components/OverviewCard";
import { MotionAlertCard } from "./components/MotionAlertCard";
import { RoomControlCard } from "./components/RoomControlCard";
import { AddRoomCard } from "./components/AddRoomCard";
import { AddRoomDialog } from "./components/AddRoomDialog";
import { EditRoomDialog } from "./components/EditRoomDialog";
import { DeleteRoomDialog } from "./components/DeleteRoomDialog";
import { HistoryChart } from "./components/HistoryChart";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import {
  getRooms,
  addRoom,
  updateRoom,
  deleteRoom,
} from "@/services/roomService";
import { getRoomTempHumidity } from "@/services/tempHumidityService";
import { getRoomMotion } from "@/services/motionService";

// ฟังก์ชันแปลงเวลาให้อ่านง่าย (dd/mm/yyyy hh:mm) - ไม่แปลง timezone
const formatDateTime = (timestamp: string): string => {
  // ใช้ string manipulation แทนการใช้ Date object เพื่อไม่ให้แปลง timezone
  // Format จาก DB: "2025-10-22T23:10:53+00:00" หรือ "2025-10-22T23:10:53"
  const dateStr = timestamp.replace('T', ' ').split('+')[0].split('.')[0]; // ตัดส่วน timezone และ milliseconds
  const [date, time] = dateStr.split(' ');
  const [year, month, day] = date.split('-');
  const [hours, minutes] = time.split(':');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

type HistoryPoint = {
  timestamp: string;
  temperature: number;
  humidity: number;
  motion: number;
};

const generateHistoricalData = (
  baseTemp: number,
  baseHumidity: number,
  points: number = 24
): HistoryPoint[] => {
  const data: HistoryPoint[] = [];
  const now = new Date();
  for (let i = points - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3600000);
    data.push({
      timestamp: time.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      temperature: parseFloat(
        (baseTemp + (Math.random() - 0.5) * 3).toFixed(1)
      ),
      humidity: Math.round(baseHumidity + (Math.random() - 0.5) * 10),
      motion: Math.random() > 0.7 ? 1 : 0,
    });
  }
  return data;
};

interface Room {
  id: number;
  name: string;
  temperature: number;
  humidity: number;
  motionDetected: boolean;
  lightOn: boolean;
  lastUpdate: string;
  historyData: HistoryPoint[];
}

interface MotionEvent {
  id: number;
  roomName: string;
  timestamp: string;
}

export default function Page() {
  const [currentPage, setCurrentPage] = useState<"dashboard" | "history">(
    "dashboard"
  );
  const [isConnected] = useState(true);
  const [historyFilter, setHistoryFilter] = useState<
    "today" | "week" | "month"
  >("today");
  const [addRoomDialogOpen, setAddRoomDialogOpen] = useState(false);
  const [editRoomDialogOpen, setEditRoomDialogOpen] = useState(false);
  const [deleteRoomDialogOpen, setDeleteRoomDialogOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [nextRoomId, setNextRoomId] = useState(3);

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const openSnack = (msg: string) => {
    setSnackMsg(msg);
    setSnackOpen(true);
  };

  const [rooms, setRooms] = useState<Room[]>([]);

  const [recentMotions, setRecentMotions] = useState<MotionEvent[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getRooms(); // [{ room_id, room_name }, ...]

        const roomsWithData = await Promise.all(
          data.map(async (r: any) => {
            try {
              // ✅ ดึงข้อมูล temp/humidity (array)
              const tempHumData = await getRoomTempHumidity(r.room_id);
              const latestTempHum =
                Array.isArray(tempHumData) && tempHumData.length > 0
                  ? tempHumData[0]
                  : null;

              // ✅ ดึงข้อมูล motion (array)
              const motionData = await getRoomMotion(r.room_id);
              const latestMotion =
                Array.isArray(motionData) && motionData.length > 0
                  ? motionData[0]
                  : null;

              // สร้าง history data รวม temp, humidity, motion
              const historyData = (tempHumData || [])
                .sort(
                  (a: any, b: any) =>
                    new Date(a.timestamp).getTime() -
                    new Date(b.timestamp).getTime()
                )
                .map((t: any) => ({
                  timestamp: formatDateTime(t.timestamp), // แปลงเวลาให้อ่านง่าย
                  temperature: t.temp,
                  humidity: t.humidity,
                  motion: motionData?.some(
                    (m: any) =>
                      Math.abs(
                        new Date(m.time_motion).getTime() -
                          new Date(t.timestamp).getTime()
                      ) <
                      60 * 1000 // มี motion ภายใน 1 นาทีเดียวกัน
                  )
                    ? 1
                    : 0,
                }));

              return {
                id: r.room_id,
                name: r.room_name,
                temperature: latestTempHum?.temp || 0,
                humidity: latestTempHum?.humidity || 0,
                motionDetected: !!latestMotion, // ถ้ามี motion record ล่าสุด
                lightOn: false,
                lastUpdate: latestTempHum?.timestamp 
                  ? formatDateTime(latestTempHum.timestamp) 
                  : formatDateTime(new Date().toISOString()), // แปลงเวลาให้อ่านง่าย
                historyData,
              };
            } catch (err) {
              console.warn(
                `⚠️ Failed to fetch data for room ${r.room_id}:`,
                err
              );
              return {
                id: r.room_id,
                name: r.room_name,
                temperature: 0,
                humidity: 0,
                motionDetected: false,
                lightOn: false,
                lastUpdate: formatDateTime(new Date().toISOString()), // แปลงเวลาให้อ่านง่าย
                historyData: [],
              };
            }
          })
        );

        setRooms(roomsWithData);
        const allMotions = roomsWithData.flatMap((r) => ({
          id: r.id,
          roomName: r.name,
          timestamp: r.lastUpdate,
        }));
        setRecentMotions(allMotions);
      } catch (error) {
        console.error("❌ Failed to fetch rooms:", error);
      }
    };

    fetchRooms();
    const interval = setInterval(fetchRooms, 500000);
    return () => clearInterval(interval);
  }, []);

  const avgTemperature =
    rooms.length > 0
      ? (rooms.reduce((s, r) => s + r.temperature, 0) / rooms.length).toFixed(1)
      : "0.0";
  const avgHumidity =
    rooms.length > 0
      ? Math.round(rooms.reduce((s, r) => s + r.humidity, 0) / rooms.length)
      : 0;
  const lightsOn = rooms.filter((r) => r.lightOn).length;
  const lastMotionRoom = rooms.find((r) => r.motionDetected);
  const lastMotion = lastMotionRoom ? lastMotionRoom.name : "None";

  const handleAddRoom = async (roomName: string) => {
    try {
      await addRoom(roomName);
      openSnack(`${roomName} added successfully`);
      // อัปเดต state จาก backend อีกที
      const data = await getRooms();
      setRooms(
        data.map((r: any) => ({
          id: r.room_id,
          name: r.room_name,
          temperature: 0,
          humidity: 0,
          motionDetected: false,
          lightOn: false,
          lastUpdate: formatDateTime(new Date().toISOString()), // แปลงเวลาให้อ่านง่าย
          historyData: [],
        }))
      );
    } catch (error) {
      openSnack("Failed to add room");
    }
  };

  const handleEditRoom = (roomId: number) => {
    setSelectedRoomId(roomId);
    setEditRoomDialogOpen(true);
  };

  const handleSaveEditRoom = async (newName: string) => {
    if (selectedRoomId !== null) {
      const oldName = rooms.find((r) => r.id === selectedRoomId)?.name;
      try {
        await updateRoom(selectedRoomId, newName);
        setRooms((prev) =>
          prev.map((r) =>
            r.id === selectedRoomId ? { ...r, name: newName } : r
          )
        );
        openSnack(`Room renamed from "${oldName}" to "${newName}"`);
      } catch (error) {
        openSnack("Failed to rename room");
      }
    }
  };

  const handleDeleteRoom = (roomId: number) => {
    setSelectedRoomId(roomId);
    setDeleteRoomDialogOpen(true);
  };

  const handleConfirmDeleteRoom = async () => {
    if (selectedRoomId !== null) {
      const room = rooms.find((r) => r.id === selectedRoomId);
      if (room) {
        try {
          await deleteRoom(selectedRoomId);
          setRooms((prev) => prev.filter((r) => r.id !== selectedRoomId));
          openSnack(`${room.name} removed from dashboard`);
        } catch (error) {
          openSnack("Failed to delete room");
        }
      }
    }
  };

  const handleLightControl = (roomId: number, isOn: boolean) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, lightOn: isOn } : r))
    );
    const room = rooms.find((r) => r.id === roomId);
    if (room) openSnack(`${room.name} light turned ${isOn ? "ON" : "OFF"}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isConnected={isConnected}
      />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {currentPage === "dashboard" && (
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl mb-4">Home Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <OverviewCard
                  title="Average Temperature"
                  value={`${avgTemperature}°C`}
                  subtitle="All rooms"
                  icon="thermostat"
                />
                <OverviewCard
                  title="Average Humidity"
                  value={`${avgHumidity}%`}
                  subtitle="All rooms"
                  icon="opacity"
                />
                <OverviewCard
                  title="Last Motion Detected"
                  value={lastMotion}
                  subtitle={
                    lastMotion !== "None" ? "Active now" : "No activity"
                  }
                  icon="sensors"
                />
                <OverviewCard
                  title="Lights ON"
                  value={`${lightsOn}/${rooms.length}`}
                  subtitle="Total rooms"
                  icon="light"
                />
              </div>
            </section>

            <section>
              <MotionAlertCard recentMotions={recentMotions} />
            </section>

            <section>
              <h2 className="text-2xl mb-4">Room Monitoring & Control</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {rooms.map((r) => (
                  <RoomControlCard
                    key={r.id}
                    roomName={r.name}
                    temperature={r.temperature}
                    humidity={r.humidity}
                    motionDetected={r.motionDetected}
                    lightOn={r.lightOn}
                    lastUpdate={r.lastUpdate}
                    onLightControl={(isOn: boolean) =>
                      handleLightControl(r.id, isOn)
                    }
                    onEdit={() => handleEditRoom(r.id)}
                    onDelete={() => handleDeleteRoom(r.id)}
                    canDelete={rooms.length > 1}
                  />
                ))}
                <AddRoomCard onAddRoom={() => setAddRoomDialogOpen(true)} />
              </div>
            </section>
          </div>
        )}

        {currentPage === "history" && (
          <div className="space-y-8">
            {React.createElement(HistoryChart as any, {
              selectedFilter: historyFilter,
              onFilterChange: setHistoryFilter,
              hasEnoughRooms: rooms.length >= 2,
              rooms: rooms,
            })}
          </div>
        )}
      </main>

      <AddRoomDialog
        open={addRoomDialogOpen}
        onOpenChange={setAddRoomDialogOpen}
        onAddRoom={handleAddRoom}
      />

      <EditRoomDialog
        open={editRoomDialogOpen}
        onOpenChange={setEditRoomDialogOpen}
        onEditRoom={handleSaveEditRoom}
        currentName={rooms.find((r) => r.id === selectedRoomId)?.name || ""}
      />

      <DeleteRoomDialog
        open={deleteRoomDialogOpen}
        onOpenChange={setDeleteRoomDialogOpen}
        onConfirmDelete={handleConfirmDeleteRoom}
        roomName={rooms.find((r) => r.id === selectedRoomId)?.name || ""}
      />

      <Snackbar
        open={snackOpen}
        autoHideDuration={2200}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackMsg}
        </Alert>
      </Snackbar>
    </div>
  );
}
