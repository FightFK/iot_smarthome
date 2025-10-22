"use client";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

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
    <Card elevation={0} sx={{ borderRadius: "14px", border: "1px solid #e5e7eb" }}>
      <CardContent>
        <Box className="flex items-start justify-between">
          <Box>
            <Typography sx={{ fontWeight: 600 }}>{roomName}</Typography>
            <Typography
              variant="caption"
              sx={{ color: "#64748b" }}
              suppressHydrationWarning
            >
              Updated: {lastUpdate || "—"}
            </Typography>
          </Box>
          <Box className="flex gap-2">
            <Button size="small" variant="outlined" onClick={onEdit}>
              Rename
            </Button>
            {canDelete && (
              <Button size="small" color="error" variant="outlined" onClick={onDelete}>
                Delete
              </Button>
            )}
          </Box>
        </Box>

        <Box className="grid grid-cols-2 gap-3 text-sm mt-3">
          <Box className="rounded bg-slate-50 p-2">Temp: <b>{temperature}°C</b></Box>
          <Box className="rounded bg-slate-50 p-2">Humidity: <b>{humidity}%</b></Box>
          <Box className="rounded bg-slate-50 p-2">Motion: <b>{motionDetected ? "Detected" : "None"}</b></Box>
          <Box className="rounded bg-slate-50 p-2 flex items-center justify-between">
            <span>Light:</span>
            <Box className="flex gap-2">
              <Button
                size="small"
                variant={lightOn ? "contained" : "outlined"}
                onClick={() => onLightControl(true)}
              >
                ON
              </Button>
              <Button
                size="small"
                variant={!lightOn ? "contained" : "outlined"}
                onClick={() => onLightControl(false)}
              >
                OFF
              </Button>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
