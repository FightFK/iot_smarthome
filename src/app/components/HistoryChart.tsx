import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  Box,
} from "@mui/material";
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

interface DataPoint {
  timestamp: string;
  temperature: number;
  humidity: number;
  motion: number;
}

export function HistoryChart() {
  // 🧠 Mock data ตัวอย่าง
  const room1Data: DataPoint[] = [
    { timestamp: "2025-10-20 09:00", temperature: 27, humidity: 70, motion: 0 },
    { timestamp: "2025-10-20 10:00", temperature: 28, humidity: 68, motion: 1 },
    { timestamp: "2025-10-20 11:00", temperature: 29, humidity: 65, motion: 0 },
    { timestamp: "2025-10-20 12:00", temperature: 30, humidity: 63, motion: 1 },
    { timestamp: "2025-10-20 13:00", temperature: 31, humidity: 60, motion: 0 },
  ];

  const room2Data: DataPoint[] = [
    { timestamp: "2025-10-20 09:00", temperature: 26, humidity: 72, motion: 0 },
    { timestamp: "2025-10-20 10:00", temperature: 27, humidity: 70, motion: 1 },
    { timestamp: "2025-10-20 11:00", temperature: 28, humidity: 68, motion: 0 },
    { timestamp: "2025-10-20 12:00", temperature: 28, humidity: 66, motion: 1 },
    { timestamp: "2025-10-20 13:00", temperature: 29, humidity: 64, motion: 0 },
  ];

  // 📊 state สำหรับ tab และ filter
  const [tabValue, setTabValue] = React.useState("room1");
  const [selectedFilter, setSelectedFilter] = React.useState("today");

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };

  return (
    <Card
      variant="outlined"
      sx={{
        borderColor: "divider",
        borderRadius: 2,
        boxShadow: 1,
        p: 2,
      }}
    >
      <CardHeader
        title={
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography variant="h6">Sensor Data History</Typography>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <Select
                labelId="filter-label"
                value={selectedFilter}
                onChange={(e) => handleFilterChange(e.target.value)}
                sx={{
                  "& fieldset": { border: "none" },
                  backgroundColor: "#e5efffff",
                  borderRadius: "8px",
                }}
              >
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="7days">Last 7 Days</MenuItem>
                <MenuItem value="all">All Data</MenuItem>
              </Select>
            </FormControl>
          </Box>
        }
      />

      <CardContent>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            backgroundColor: "#f1f5f9", // สีพื้นหลังเทาอ่อน
            borderRadius: "9999px", // มุมโค้งมาก
            padding: "4px",
            width: "fit-content",
          }}
          TabIndicatorProps={{ style: { display: "none" } }} // ซ่อนเส้น indicator ใต้แท็บ
        >
          <Tab
            label="Room 1"
            value="room1"
            sx={{
              textTransform: "none",
              minWidth: 100,
              borderRadius: "9999px",
              color: tabValue === "room1" ? "#000" : "#475569",
              backgroundColor: tabValue === "room1" ? "#fff" : "transparent",
              fontWeight: 500,
              "&:hover": {
                backgroundColor: tabValue === "room1" ? "#fff" : "#f8fafc",
              },
            }}
          />
          <Tab
            label="Room 2"
            value="room2"
            sx={{
              textTransform: "none",
              minWidth: 100,
              borderRadius: "9999px",
              color: tabValue === "room2" ? "#000" : "#475569",
              backgroundColor: tabValue === "room2" ? "#fff" : "transparent",
              fontWeight: 500,
              "&:hover": {
                backgroundColor: tabValue === "room2" ? "#fff" : "#f8fafc",
              },
            }}
          />
        </Tabs>

        {/* Room 1 */}
        {tabValue === "room1" && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Temperature & Humidity
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={room1Data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Temperature (°C)"
                  dot={{ fill: "#ef4444", r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="humidity"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Humidity (%)"
                  dot={{ fill: "#3b82f6", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>

            <Box sx={{ mt: 6 }}>
              <Typography variant="subtitle2" gutterBottom>
                Motion Detection Events
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={room1Data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                      border: "1px solid #e0e0e0",
                    }}
                  />
                  <Legend />
                  <Line
                    type="stepAfter"
                    dataKey="motion"
                    stroke="#f97316"
                    strokeWidth={2}
                    name="Motion Detected"
                    dot={{ fill: "#f97316", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        )}

        {/* Room 2 */}
        {tabValue === "room2" && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Temperature & Humidity
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={room2Data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Temperature (°C)"
                  dot={{ fill: "#ef4444", r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="humidity"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Humidity (%)"
                  dot={{ fill: "#3b82f6", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>

            <Box sx={{ mt: 6 }}>
              <Typography variant="subtitle2" gutterBottom>
                Motion Detection Events
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={room2Data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                      border: "1px solid #e0e0e0",
                    }}
                  />
                  <Legend />
                  <Line
                    type="stepAfter"
                    dataKey="motion"
                    stroke="#f97316"
                    strokeWidth={2}
                    name="Motion Detected"
                    dot={{ fill: "#f97316", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
