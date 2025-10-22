"use client";

import { useEffect, useState } from "react";
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
      temperature: parseFloat((baseTemp + (Math.random() - 0.5) * 3).toFixed(1)),
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
  lastUpdate: string;        // เวลาแสดงล่าสุด
  historyData: HistoryPoint[];
}

interface MotionEvent {
  id: number;
  roomName: string;
  timestamp: string;
}

export default function Page() {
  const [currentPage, setCurrentPage] = useState<"dashboard" | "history">("dashboard");
  const [isConnected] = useState(true);
  const [historyFilter, setHistoryFilter] = useState<"today" | "week" | "month">("today");
  const [addRoomDialogOpen, setAddRoomDialogOpen] = useState(false);
  const [editRoomDialogOpen, setEditRoomDialogOpen] = useState(false);
  const [deleteRoomDialogOpen, setDeleteRoomDialogOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [nextRoomId, setNextRoomId] = useState(3);

  // Snackbar
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const openSnack = (msg: string) => {
    setSnackMsg(msg);
    setSnackOpen(true);
  };

  // ✅ ไม่ใส่เวลาเริ่มต้นตอน SSR เพื่อเลี่ยง hydration mismatch
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: 1,
      name: "Room 1",
      temperature: 24.5,
      humidity: 55,
      motionDetected: true,
      lightOn: true,
      lastUpdate: "", // <— เว้นไว้ก่อน
      historyData: generateHistoricalData(24.5, 55),
    },
    {
      id: 2,
      name: "Room 2",
      temperature: 26.2,
      humidity: 62,
      motionDetected: false,
      lightOn: false,
      lastUpdate: "", // <— เว้นไว้ก่อน
      historyData: generateHistoricalData(26.2, 62),
    },
  ]);

  const [recentMotions] = useState<MotionEvent[]>([
    { id: 1, roomName: "Room 1", timestamp: "2 minutes ago" },
    { id: 2, roomName: "Room 1", timestamp: "15 minutes ago" },
    { id: 3, roomName: "Room 2", timestamp: "1 hour ago" },
  ]);

  // ✅ หลัง mount ค่อยตั้งค่าเวลาเริ่มต้น แล้วจึงเริ่ม interval
  useEffect(() => {
    // ตั้งค่าเวลาเริ่มต้นให้ทุกห้อง
    setRooms(prev =>
      prev.map(r => ({ ...r, lastUpdate: new Date().toLocaleTimeString() }))
    );

    const t = setInterval(() => {
      setRooms(prev =>
        prev.map(room => ({
          ...room,
          temperature: parseFloat((room.temperature + (Math.random() - 0.5) * 0.5).toFixed(1)),
          humidity: Math.max(0, Math.min(100, room.humidity + Math.round((Math.random() - 0.5) * 2))),
          motionDetected: Math.random() > 0.85,
          lastUpdate: new Date().toLocaleTimeString(), // อัปเดตเวลาที่ฝั่ง client เท่านั้น
        }))
      );
    }, 5000);

    return () => clearInterval(t);
  }, []);

  const avgTemperature =
    rooms.length > 0
      ? (rooms.reduce((s, r) => s + r.temperature, 0) / rooms.length).toFixed(1)
      : "0.0";
  const avgHumidity =
    rooms.length > 0
      ? Math.round(rooms.reduce((s, r) => s + r.humidity, 0) / rooms.length)
      : 0;
  const lightsOn = rooms.filter(r => r.lightOn).length;
  const lastMotionRoom = rooms.find(r => r.motionDetected);
  const lastMotion = lastMotionRoom ? lastMotionRoom.name : "None";

  // Add room
  const handleAddRoom = (roomName: string) => {
    const baseTemp = 22 + Math.random() * 6;
    const baseHumidity = 45 + Math.random() * 30;
    const newRoom: Room = {
      id: nextRoomId,
      name: roomName,
      temperature: parseFloat(baseTemp.toFixed(1)),
      humidity: Math.round(baseHumidity),
      motionDetected: false,
      lightOn: false,
      lastUpdate: new Date().toLocaleTimeString(), // เหตุการณ์ฝั่ง client
      historyData: generateHistoricalData(baseTemp, baseHumidity),
    };
    setRooms(prev => [...prev, newRoom]);
    setNextRoomId(p => p + 1);
    openSnack(`${roomName} added successfully`);
  };

  // Edit room name
  const handleEditRoom = (roomId: number) => {
    setSelectedRoomId(roomId);
    setEditRoomDialogOpen(true);
  };

  const handleSaveEditRoom = (newName: string) => {
    if (selectedRoomId !== null) {
      const oldName = rooms.find(r => r.id === selectedRoomId)?.name;
      setRooms(prev =>
        prev.map(r => (r.id === selectedRoomId ? { ...r, name: newName } : r))
      );
      openSnack(`Room renamed from "${oldName}" to "${newName}"`);
    }
  };

  // Delete room
  const handleDeleteRoom = (roomId: number) => {
    setSelectedRoomId(roomId);
    setDeleteRoomDialogOpen(true);
  };

  const handleConfirmDeleteRoom = () => {
    if (selectedRoomId !== null) {
      const room = rooms.find(r => r.id === selectedRoomId);
      if (room) {
        setRooms(prev => prev.filter(r => r.id !== selectedRoomId));
        openSnack(`${room.name} removed from dashboard`);
      }
    }
  };

  // Light control
  const handleLightControl = (roomId: number, isOn: boolean) => {
    setRooms(prev => prev.map(r => (r.id === roomId ? { ...r, lightOn: isOn } : r)));
    const room = rooms.find(r => r.id === roomId);
    if (room) openSnack(`${room.name} light turned ${isOn ? "ON" : "OFF"}`);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50">
      {/* Tailwind v4: ใช้ bg-linear-to-br แทน bg-gradient-to-br */}

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
                  subtitle={lastMotion !== "None" ? "Active now" : "No activity"}
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
                {rooms.map(r => (
                  <RoomControlCard
                    key={r.id}
                    roomName={r.name}
                    temperature={r.temperature}
                    humidity={r.humidity}
                    motionDetected={r.motionDetected}
                    lightOn={r.lightOn}
                    lastUpdate={r.lastUpdate}
                    onLightControl={(isOn: boolean) => handleLightControl(r.id, isOn)}
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
            <HistoryChart
              selectedFilter={historyFilter}
              onFilterChange={setHistoryFilter}
              hasEnoughRooms={rooms.length >= 2}
            />
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
        currentName={rooms.find(r => r.id === selectedRoomId)?.name || ""}
      />

      <DeleteRoomDialog
        open={deleteRoomDialogOpen}
        onOpenChange={setDeleteRoomDialogOpen}
        onConfirmDelete={handleConfirmDeleteRoom}
        roomName={rooms.find(r => r.id === selectedRoomId)?.name || ""}
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
