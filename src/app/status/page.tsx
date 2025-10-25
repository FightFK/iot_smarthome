"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import { DashboardHeader } from "../components/DashboardHeader";
import { Footer } from "../components/Footer";
import { getRooms } from "@/services/roomService";
import { getRoomTempHumidity } from "@/services/tempHumidityService";
import { getRoomMotion } from "@/services/motionService";
import axios from "axios";
import Link from "next/link";
interface SensorStatus {
  room_id: number;
  room_name: string;
  temperature?: number;
  humidity?: number;
  lastUpdate?: string;
  status: "online" | "offline" | "warning";
  motionDetected?: boolean;
  lastMotion?: string;
  motionError?: boolean; // มี motion ส่งมารัวๆ = sensor มีปัญหา
  motionCount?: number; // จำนวน motion events ใน 1 นาที
}

function formatDateTime(isoString: string): string {
  if (!isoString) return "No data";
  try {
    const parts = isoString.split("T");
    if (parts.length < 2) return isoString;
    const datePart = parts[0];
    const timePart = parts[1].split(".")[0] || parts[1].split("+")[0];
    const [year, month, day] = datePart.split("-");
    const [hour, minute, second] = timePart.split(":");
    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  } catch {
    return isoString;
  }
}

function getTimeDifference(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hr ago`;
  return `${diffDays} day ago`;
}

export default function StatusPage() {
  const router = useRouter();
  const [sensors, setSensors] = useState<SensorStatus[]>([]);
  const [mqttStatus, setMqttStatus] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSensorStatus() {
      setLoading(true);
      setError(null);
      try {
        // 1. ดึงข้อมูล MQTT status
        const mqttRes = await axios.get("/api/v1/status");
        setMqttStatus(mqttRes.data.connected || true);

        // 2. ดึงรายการห้อง
        const rooms = await getRooms();

        // 3. ดึงข้อมูล sensor แต่ละห้อง
        const sensorData = await Promise.all(
          rooms.map(async (room: any) => {
            try {
              // ดึงข้อมูล temp/humidity ล่าสุด
              const tempHumData = await getRoomTempHumidity(room.room_id);
              const latestTempHum =
                tempHumData && tempHumData.length > 0 ? tempHumData[0] : null;

              // ดึงข้อมูล motion ล่าสุด
              const motionData = await getRoomMotion(room.room_id);
              const latestMotion =
                motionData && motionData.length > 0 ? motionData[0] : null;

              // เช็คว่า motion sensor ส่งข้อมูลรัวๆ หรือไม่ (อาจมีปัญหา)
              let motionError = false;
              let motionCountInLastMinute = 0;
              if (motionData && motionData.length > 0) {
                const now = new Date();
                const oneMinuteAgo = new Date(now.getTime() - 60 * 1000); // 1 นาทีที่แล้ว
                
                motionCountInLastMinute = motionData.filter((m: any) => {
                  const motionTime = new Date(m.time_motion);
                  return motionTime >= oneMinuteAgo && motionTime <= now;
                }).length;

                // ถ้ามี motion มากกว่า 20 ครั้งใน 1 นาที = sensor มีปัญหา
                if (motionCountInLastMinute > 20) {
                  motionError = true;
                }
              }

              // คำนวณสถานะ
              let status: "online" | "offline" | "warning" = "offline";
              if (latestTempHum) {
                const lastUpdateTime = new Date(latestTempHum.timestamp);
                const now = new Date();
                const diffMinutes =
                  (now.getTime() - lastUpdateTime.getTime()) / 60000;

                if (diffMinutes < 5) {
                  status = "online";
                } else if (diffMinutes < 15) {
                  status = "warning";
                } else {
                  status = "offline";
                }
              }

              // เช็คว่ามี motion ใน 5 นาทีที่ผ่านมาไหม
              let hasRecentMotion = false;
              if (latestMotion) {
                const motionTime = new Date(latestMotion.time_motion);
                const now = new Date();
                const diffMinutes = (now.getTime() - motionTime.getTime()) / 60000;
                hasRecentMotion = diffMinutes < 5;
              }

              return {
                room_id: room.room_id,
                room_name: room.room_name,
                temperature: latestTempHum?.temp,
                humidity: latestTempHum?.humidity,
                lastUpdate: latestTempHum?.timestamp,
                status,
                motionDetected: hasRecentMotion,
                lastMotion: latestMotion?.time_motion,
                motionError,
                motionCount: motionCountInLastMinute,
              };
            } catch (err) {
              console.error(`Error loading sensor for room ${room.room_id}:`, err);
              return {
                room_id: room.room_id,
                room_name: room.room_name,
                status: "offline" as const,
              };
            }
          })
        );

        setSensors(sensorData);
      } catch (err: any) {
        console.error("Error loading sensor status:", err);
        setError(err.message || "Failed to load sensor status");
      } finally {
        setLoading(false);
      }
    }

    loadSensorStatus();
    const interval = setInterval(loadSensorStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const onlineCount = sensors.filter((s) => s.status === "online").length;
  const warningCount = sensors.filter((s) => s.status === "warning").length;
  const offlineCount = sensors.filter((s) => s.status === "offline").length;
  const motionErrorCount = sensors.filter((s) => s.motionError).length;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        currentPage="status" 
        onNavigate={(page) => {
          if (page === "dashboard") {
            router.push("/");
          } else if (page === "history") {
            router.push("/?page=history");
          }
        }} 
      />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          📊 System Status
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : (
          <>
            {/* Overview Cards */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(5, 1fr)" },
                gap: 3,
                mb: 4,
              }}
            >
              {/* MQTT Status */}
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1}>
                    {mqttStatus ? (
                      <CheckCircleIcon sx={{ color: "success.main", fontSize: 40 }} />
                    ) : (
                      <ErrorIcon sx={{ color: "error.main", fontSize: 40 }} />
                    )}
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        MQTT Server
                      </Typography>
                      <Typography variant="h6">
                        {mqttStatus ? "Connected" : "Disconnected"}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Online Sensors */}
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CheckCircleIcon sx={{ color: "success.main", fontSize: 40 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Online
                      </Typography>
                      <Typography variant="h6">{onlineCount} Sensors</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Warning Sensors */}
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1}>
                    <WarningIcon sx={{ color: "warning.main", fontSize: 40 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Warning
                      </Typography>
                      <Typography variant="h6">{warningCount} Sensors</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Offline Sensors */}
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1}>
                    <ErrorIcon sx={{ color: "error.main", fontSize: 40 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Offline
                      </Typography>
                      <Typography variant="h6">{offlineCount} Sensors</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Motion Errors */}
              <Card sx={{ bgcolor: motionErrorCount > 0 ? "error.light" : "background.paper" }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1}>
                    <ErrorIcon sx={{ color: motionErrorCount > 0 ? "error.dark" : "text.disabled", fontSize: 40 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Motion Errors
                      </Typography>
                      <Typography variant="h6" color={motionErrorCount > 0 ? "error.dark" : "inherit"}>
                        {motionErrorCount} Sensors
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* Sensor Details Table */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Sensor Details
                </Typography>
                <TableContainer component={Paper} elevation={0}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <strong>Room</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Status</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Temperature</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Humidity</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Motion</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Last Update</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sensors.map((sensor) => (
                        <TableRow key={sensor.room_id}>
                          <TableCell>{sensor.room_name}</TableCell>
                          <TableCell>
                            <Chip
                              icon={
                                sensor.status === "online" ? (
                                  <CheckCircleIcon />
                                ) : sensor.status === "warning" ? (
                                  <WarningIcon />
                                ) : (
                                  <ErrorIcon />
                                )
                              }
                              label={sensor.status.toUpperCase()}
                              color={
                                sensor.status === "online"
                                  ? "success"
                                  : sensor.status === "warning"
                                  ? "warning"
                                  : "error"
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {sensor.temperature !== undefined
                              ? `${sensor.temperature.toFixed(1)}°C`
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            {sensor.humidity !== undefined
                              ? `${sensor.humidity.toFixed(0)}%`
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            <Box display="flex" flexDirection="column" gap={0.5}>
                              <Chip
                                label={sensor.motionDetected ? "Detected" : "Clear"}
                                color={sensor.motionDetected ? "warning" : "default"}
                                size="small"
                                variant={sensor.motionDetected ? "filled" : "outlined"}
                              />
                              {sensor.motionError && (
                                <Chip
                                  icon={<ErrorIcon />}
                                  label={`ERROR (${sensor.motionCount} events/min)`}
                                  color="error"
                                  size="small"
                                />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            {sensor.lastUpdate ? (
                              <Box>
                                <Typography variant="body2">
                                  {getTimeDifference(sensor.lastUpdate)}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {formatDateTime(sensor.lastUpdate)}
                                </Typography>
                              </Box>
                            ) : (
                              "No data"
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Legend */}
                <Box sx={{ mt: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Status Legend:</strong>
                  </Typography>
                  <Box display="flex" gap={3} flexWrap="wrap" mb={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CheckCircleIcon sx={{ color: "success.main" }} fontSize="small" />
                      <Typography variant="body2">
                        Online - Updated within 5 minutes
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <WarningIcon sx={{ color: "warning.main" }} fontSize="small" />
                      <Typography variant="body2">
                        Warning - Updated 5-15 minutes ago
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <ErrorIcon sx={{ color: "error.main" }} fontSize="small" />
                      <Typography variant="body2">
                        Offline - No update for 15+ minutes
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Motion Sensor:</strong>
                  </Typography>
                  <Box display="flex" gap={3} flexWrap="wrap">
                    <Box display="flex" alignItems="center" gap={1}>
                      <ErrorIcon sx={{ color: "error.main" }} fontSize="small" />
                      <Typography variant="body2">
                        Motion Error - Sensor sending too many events (&gt;20/min) - Hardware malfunction
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
