"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { getHistoryData, type HistoryData } from "@/services/historyService";
import { getRooms } from "@/services/roomService";

function formatDateTime(isoString: string): string {
  if (!isoString) return "";
  try {
    const parts = isoString.split("T");
    if (parts.length < 2) return isoString;
    const datePart = parts[0];
    const timePart = parts[1].split(".")[0] || parts[1].split("+")[0];
    const [year, month, day] = datePart.split("-");
    const [hour, minute] = timePart.split(":");
    return `${day}/${month}/${year} ${hour}:${minute}`;
  } catch {
    return isoString;
  }
}

function formatTime(isoString: string): string {
  if (!isoString) return "";
  try {
    const parts = isoString.split("T");
    if (parts.length < 2) return isoString;
    const timePart = parts[1].split(".")[0] || parts[1].split("+")[0];
    const [hour, minute] = timePart.split(":");
    return `${hour}:${minute}`;
  } catch {
    return isoString;
  }
}

export function HistoryChart() {
  const [historyData, setHistoryData] = useState<HistoryData | null>(null);
  const [rooms, setRooms] = useState<{ room_id: number; room_name: string }[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<number | "all">("all");
  const [timeRange, setTimeRange] = useState<number>(24);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRooms() {
      try {
        const data = await getRooms();
        if (data) {
          setRooms(data);
        }
      } catch (err) {
        console.error("Error loading rooms:", err);
      }
    }
    loadRooms();
  }, []);

  useEffect(() => {
    async function loadHistory() {
      setLoading(true);
      setError(null);
      try {
        const data = await getHistoryData(selectedRoom, timeRange);
        setHistoryData(data);
      } catch (err: any) {
        console.error("Error loading history:", err);
        setError(err.message || "Failed to load history data");
      } finally {
        setLoading(false);
      }
    }
    loadHistory();

    const interval = setInterval(loadHistory, 30000);
    return () => clearInterval(interval);
  }, [selectedRoom, timeRange]);

  const chartData =
    historyData?.tempHumidity.map((item) => ({
      time: formatTime(item.timestamp),
      temperature: item.temp,
      humidity: item.humidity,
    })) || [];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Box display="flex" gap={2} flexWrap="wrap">
        <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Room</InputLabel>
          <Select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value as number | "all")}
            label="Room"
          >
            <MenuItem value="all">All Rooms</MenuItem>
            {rooms.map((room) => (
              <MenuItem key={room.room_id} value={room.room_id}>
                {room.room_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(Number(e.target.value))}
            label="Time Range"
          >
            <MenuItem value={1}>Last 1 Hour</MenuItem>
            <MenuItem value={6}>Last 6 Hours</MenuItem>
            <MenuItem value={12}>Last 12 Hours</MenuItem>
            <MenuItem value={24}>Last 24 Hours</MenuItem>
            <MenuItem value={72}>Last 3 Days</MenuItem>
            <MenuItem value={168}>Last Week</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Card elevation={0} sx={{ border: 1, borderColor: "divider" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Temperature & Humidity Trends
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="time"
                stroke="var(--muted-foreground)"
                style={{ fontSize: "12px" }}
              />
              <YAxis stroke="var(--muted-foreground)" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#ef4444"
                strokeWidth={2}
                name="Temperature (°C)"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="humidity"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Humidity (%)"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card elevation={0} sx={{ border: 1, borderColor: "divider" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Motion Detections
          </Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Room</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Time</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {historyData?.motion && historyData.motion.length > 0 ? (
                  historyData.motion.map((m, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{m.Room?.room_name || `Room ${m.room_id}`}</TableCell>
                      <TableCell>{formatDateTime(m.time_motion)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      No motion detected in selected time range
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </div>
  );
}
