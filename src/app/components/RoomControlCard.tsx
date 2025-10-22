"use client";

import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import OpacityIcon from "@mui/icons-material/Opacity";
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: "calc(var(--radius) + 4px)",
        border: "1px solid var(--border)",
        bgcolor: "var(--card)",
      }}
    >
      <CardContent sx={{ p: 0 }}>
        {/* Header */}
        <Box
          className="flex items-center justify-between"
          sx={{
            px: 2,
            py: 1.5,
            borderBottom: "1px solid var(--border)",
            background: "color-mix(in oklch, var(--accent) 35%, transparent)",
            borderTopLeftRadius: "calc(var(--radius) + 4px)",
            borderTopRightRadius: "calc(var(--radius) + 4px)",
          }}
        >
          <Box className="flex items-center gap-2">
            <Box
              className="grid place-items-center"
              sx={{
                width: 28,
                height: 28,
                borderRadius: "calc(var(--radius) - 2px)",
                background: "var(--accent)",
                border: "1px solid var(--border)",
              }}
            >
              <LightbulbRoundedIcon sx={{ color: "var(--foreground)" }} fontSize="small" />
            </Box>
            <Typography sx={{ fontWeight: 600, color: "var(--foreground)" }}>
              {roomName}
            </Typography>
          </Box>

          <Box className="flex items-center gap-1.5">
            <Chip
              label={lightOn ? "Light ON" : "Light OFF"}
              size="small"
              sx={{
                borderRadius: 999,
                bgcolor: lightOn
                  ? "color-mix(in oklch, var(--chart-4) 25%, white)"
                  : "var(--accent)",
                color: "var(--foreground)",
                height: 22,
              }}
            />
            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreVertRoundedIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem
                onClick={() => {
                  onEdit();
                  handleMenuClose();
                }}
              >
                Edit
              </MenuItem>
              {canDelete && (
                <MenuItem
                  onClick={() => {
                    onDelete();
                    handleMenuClose();
                  }}
                  sx={{ color: "var(--destructive)" }}
                >
                  Delete
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Box>

        {/* Body */}
        <Box className="p-3 grid grid-cols-2 gap-3 text-sm">
          {/* Temperature */}
          <Box
            sx={{
              border: "1px solid var(--border)",
              bgcolor: "var(--popover)",
              borderRadius: "var(--radius)",
              p: 3,
            }}
          >
            <Box className="flex items-center gap-1.5 mb-1">
              <ThermostatIcon sx={{ color: "var(--foreground)" }} fontSize="small" />
              <Typography variant="caption" sx={{ color: "var(--muted-foreground)" }}>
                Temperature
              </Typography>
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: 22, color: "var(--foreground)" }}>
              {temperature.toFixed(1)}°C
            </Typography>
          </Box>

          {/* Humidity */}
          <Box
            sx={{
              border: "1px solid var(--border)",
              bgcolor: "var(--popover)",
              borderRadius: "var(--radius)",
              p: 3,
            }}
          >
            <Box className="flex items-center gap-1.5 mb-1">
              <OpacityIcon sx={{ color: "var(--foreground)" }} fontSize="small" />
              <Typography variant="caption" sx={{ color: "var(--muted-foreground)" }}>
                Humidity
              </Typography>
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: 22, color: "var(--foreground)" }}>
              {humidity}%
            </Typography>
          </Box>

          {/* Motion */}
          <Box
            className="col-span-2"
            sx={{
              border: "1px solid var(--border)",
              bgcolor: "var(--popover)",
              borderRadius: "var(--radius)",
              p: 3,
            }}
          >
            <Box className="flex items-center gap-1.5">
              <TimelineRoundedIcon sx={{ color: "var(--muted-foreground)" }} fontSize="small" />
              <Typography variant="caption" sx={{ color: "var(--muted-foreground)" }}>
                Motion Status
              </Typography>
            </Box>
            <Typography sx={{ mt: 0.5, fontWeight: 600, color: "var(--foreground)" }}>
              {motionDetected ? "Motion Detected" : "No Motion"}
            </Typography>
          </Box>

          {/* Controls */}
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
                  textTransform: "none",
                  bgcolor: "var(--primary)",
                  color: "var(--primary-foreground)",
                  "&:hover": {
                    bgcolor: "color-mix(in oklch, var(--primary) 92%, black)",
                  },
                }}
              >
                Turn ON
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => onLightControl(false)}
                sx={{ textTransform: "none", borderColor: "var(--border)", color: "var(--foreground)" }}
              >
                Turn OFF
              </Button>
            </Box>
          </Box>

          {/* Footer */}
          <Box className="col-span-2 flex items-center gap-1.5">
            <AccessTimeRoundedIcon sx={{ fontSize: 18, color: "var(--muted-foreground)" }} />
            <Typography
              variant="caption"
              sx={{ color: "var(--muted-foreground)" }}
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
