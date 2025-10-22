"use client";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import OpacityIcon from "@mui/icons-material/Opacity";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";

export function RoomControlCard({
  roomName,
  temperature,
  humidity,
  motionDetected,
  lightOn,
  lastUpdate,
  onLightControl,
  onEdit,
  onDelete,
  canDelete,
}: {
  roomName: string;
  temperature: number;
  humidity: number;
  motionDetected: boolean;
  lightOn: boolean;
  lastUpdate: string;
  onLightControl: (isOn: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
  canDelete?: boolean;
}) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: "16px",
        border: "1px solid #e5e7eb",
        bgcolor: "rgba(255,255,255,.95)",
        boxShadow: "0 2px 12px rgba(15,23,42,.05)",
      }}
    >
      <CardContent sx={{ p: 0 }}>
        {/* header */}
        <Box
          className="flex items-center justify-between"
          sx={{
            px: 2,
            py: 1.5,
            borderBottom: "1px solid #e5e7eb",
            background: "linear-gradient(180deg, rgba(226,232,240,.45), rgba(226,232,240,.25))",
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
          }}
        >
          <Box className="flex items-center gap-2">
            <Box
              className="grid place-items-center"
              sx={{
                width: 28,
                height: 28,
                borderRadius: "8px",
                background: "linear-gradient(135deg,#eff6ff,#ecfeff)",
                border: "1px solid #e5e7eb",
              }}
            >
              <LightbulbRoundedIcon sx={{ color: "#2563eb" }} fontSize="small" />
            </Box>
            <Typography sx={{ fontWeight: 600 }}>{roomName}</Typography>
          </Box>

          <Box className="flex items-center gap-1.5">
            <Chip
              label={lightOn ? "Light ON" : "Light OFF"}
              size="small"
              sx={{
                borderRadius: 999,
                bgcolor: lightOn ? "rgba(16,185,129,.15)" : "rgba(148,163,184,.2)",
                color: lightOn ? "#065f46" : "#475569",
                height: 22,
              }}
            />
            <Button size="small" variant="text" onClick={onEdit}>
              <MoreVertRoundedIcon fontSize="small" />
            </Button>
            {canDelete && (
              <Button size="small" color="error" variant="text" onClick={onDelete}>
                Delete
              </Button>
            )}
          </Box>
        </Box>

        {/* body */}
        <Box className="p-3 grid grid-cols-2 gap-3 text-sm">
          {/* Temp */}
          <Box
            className="rounded-xl p-3"
            sx={{
              border: "1px solid #fee2e2",
              bgcolor: "#fff7f7",
            }}
          >
            <Box className="flex items-center gap-1.5 mb-1">
              <ThermostatIcon sx={{ color: "#ef4444" }} fontSize="small" />
              <Typography variant="caption" sx={{ color: "#ef4444" }}>
                Temperature
              </Typography>
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: 22, color: "#ef4444" }}>
              {temperature.toFixed(1)}°C
            </Typography>
          </Box>

          {/* Humidity */}
          <Box
            className="rounded-xl p-3"
            sx={{
              border: "1px solid #dbeafe",
              bgcolor: "#f0f9ff",
            }}
          >
            <Box className="flex items-center gap-1.5 mb-1">
              <OpacityIcon sx={{ color: "#2563eb" }} fontSize="small" />
              <Typography variant="caption" sx={{ color: "#2563eb" }}>
                Humidity
              </Typography>
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: 22, color: "#2563eb" }}>
              {humidity}%
            </Typography>
          </Box>

          {/* Motion */}
          <Box
            className="col-span-2 rounded-xl p-3"
            sx={{
              border: "1px solid #e5e7eb",
              bgcolor: "#f8fafc",
            }}
          >
            <Box className="flex items-center gap-1.5">
              <TimelineRoundedIcon sx={{ color: "#64748b" }} fontSize="small" />
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                Motion Status
              </Typography>
            </Box>
            <Typography sx={{ mt: 0.5, fontWeight: 600, color: "#0f172a" }}>
              {motionDetected ? "Motion Detected" : "No Motion"}
            </Typography>
          </Box>

          {/* Light Control */}
          <Box className="col-span-2">
            <Typography variant="body2" sx={{ mb: 1 }}>
              Light Control
            </Typography>
            <Box className="flex items-center gap-2">
              <Button
                variant="contained"
                size="small"
                onClick={() => onLightControl(true)}
                sx={{
                  bgcolor: "#22c55e",
                  "&:hover": { bgcolor: "#16a34a" },
                  textTransform: "none",
                }}
              >
                Turn ON
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => onLightControl(false)}
                sx={{ textTransform: "none" }}
              >
                Turn OFF
              </Button>
            </Box>
          </Box>

          {/* Footer time */}
          <Box className="col-span-2 flex items-center gap-1.5 text-slate-500">
            <AccessTimeRoundedIcon sx={{ fontSize: 18, color: "#64748b" }} />
            <Typography
              variant="caption"
              sx={{ color: "#64748b" }}
              suppressHydrationWarning
            >
              Last updated: {lastUpdate || "—"}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
