"use client";

import { useMemo, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export type HistoryFilter = "today" | "week" | "month";

export type HistoryChartProps = {
  selectedFilter: HistoryFilter;
  onFilterChange: (f: HistoryFilter) => void;
  hasEnoughRooms: boolean;
};

const colors = {
  temperature: "var(--chart-5)",
  humidity: "var(--chart-2)",
  motionFill: "color-mix(in oklch, var(--chart-4) 25%, transparent)",
  motionStroke: "var(--chart-4)",
  axis: "var(--muted-foreground)",
  grid: "color-mix(in oklch, var(--border) 65%, transparent)",
  tooltipBg: "var(--popover)",
  tooltipBorder: "var(--border)",
  tooltipText: "var(--foreground)",
};

function makeData(roomIndex: number, filter: HistoryFilter) {
  const ticks =
    filter === "today"
      ? ["09:00", "10:00", "11:00", "12:00", "13:00"]
      : filter === "week"
      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      : ["W1", "W2", "W3", "W4"];
  const baseTemp = roomIndex === 0 ? 26 : 23;
  const baseHum = roomIndex === 0 ? 68 : 52;
  return ticks.map((t, i) => ({
    time: t,
    temperature: baseTemp + (roomIndex ? 0.6 : 0.4) * i,
    humidity: baseHum - 1.2 * i,
    motion:
      filter === "today"
        ? i === 1 || i === 4
          ? 1
          : 0
        : i % 2,
  }));
}

export function HistoryChart({
  selectedFilter,
  onFilterChange,
  hasEnoughRooms,
}: HistoryChartProps) {
  const [roomTab, setRoomTab] = useState<"room1" | "room2">("room1");
  const data = useMemo(
    () => makeData(roomTab === "room1" ? 0 : 1, selectedFilter),
    [roomTab, selectedFilter]
  );

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: "calc(var(--radius) + 4px)",
        border: "1px solid var(--border)",
        bgcolor: "var(--card)",
      }}
    >
      <CardContent sx={{ pb: 3 }}>
        <Box className="flex items-center justify-between mb-3">
          <Typography sx={{ fontWeight: 600, color: "var(--foreground)" }}>
            Sensor Data History
          </Typography>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel id="history-filter-label">Range</InputLabel>
            <Select
              labelId="history-filter-label"
              label="Range"
              value={selectedFilter}
              onChange={(e) => onFilterChange(e.target.value as HistoryFilter)}
            >
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="week">Last 7 days</MenuItem>
              <MenuItem value="month">Last 30 days</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <ToggleButtonGroup
          color="primary"
          size="small"
          exclusive
          value={roomTab}
          onChange={(_, v) => v && setRoomTab(v)}
          sx={{ mb: 2 }}
        >
          <ToggleButton value="room1">Room 1</ToggleButton>
          <ToggleButton value="room2">Room 2</ToggleButton>
        </ToggleButtonGroup>

        {hasEnoughRooms ? (
          <Box sx={{ display: "grid", gap: 4 }}>
            <Box>
              <Typography variant="body2" sx={{ mb: 1, color: "var(--muted-foreground)" }}>
                Temperature (°C)
              </Typography>
              <Box sx={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke={colors.grid} strokeDasharray="3 3" />
                    <XAxis dataKey="time" stroke={colors.axis} />
                    <YAxis stroke={colors.axis} width={36} />
                    <Tooltip
                      contentStyle={{
                        background: colors.tooltipBg,
                        border: `1px solid ${colors.tooltipBorder}`,
                        borderRadius: 10,
                        color: colors.tooltipText,
                      }}
                      labelStyle={{ color: colors.tooltipText }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      name="Temperature (°C)"
                      stroke={colors.temperature}
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ mb: 1, color: "var(--muted-foreground)" }}>
                Humidity (%)
              </Typography>
              <Box sx={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke={colors.grid} strokeDasharray="3 3" />
                    <XAxis dataKey="time" stroke={colors.axis} />
                    <YAxis stroke={colors.axis} width={36} />
                    <Tooltip
                      contentStyle={{
                        background: colors.tooltipBg,
                        border: `1px solid ${colors.tooltipBorder}`,
                        borderRadius: 10,
                        color: colors.tooltipText,
                      }}
                      labelStyle={{ color: colors.tooltipText }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="humidity"
                      name="Humidity (%)"
                      stroke={colors.humidity}
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ mb: 1, color: "var(--muted-foreground)" }}>
                Motion Detection Events
              </Typography>
              <Box sx={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke={colors.grid} strokeDasharray="3 3" />
                    <XAxis dataKey="time" stroke={colors.axis} />
                    <YAxis stroke={colors.axis} domain={[0, 1]} ticks={[0, 1]} width={28} />
                    <Tooltip
                      contentStyle={{
                        background: colors.tooltipBg,
                        border: `1px solid ${colors.tooltipBorder}`,
                        borderRadius: 10,
                        color: colors.tooltipText,
                      }}
                      labelStyle={{ color: colors.tooltipText }}
                    />
                    <Area
                      type="stepAfter"
                      dataKey="motion"
                      name="Motion"
                      stroke={colors.motionStroke}
                      fill={colors.motionFill}
                      strokeWidth={2}
                      dot={{ r: 2 }}
                      activeDot={{ r: 4 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box className="text-center py-12">
            <Typography sx={{ color: "var(--muted-foreground)" }}>
              Add at least 2 rooms to view historical data
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default HistoryChart;
