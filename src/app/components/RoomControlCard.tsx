"use client";

import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
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
  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: "calc(var(--radius) + 4px)",
        border: "1px solid var(--border)",
        bgcolor: "var(--card)",
        width: "100%",
        maxWidth: 400,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent sx={{ p: 0, flex: "1 1 auto" }}>
        {/* Header */}
        <Box
          className="flex items-center justify-between flex-wrap gap-2"
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
              <LightbulbRoundedIcon
                sx={{ color: "var(--foreground)" }}
                fontSize="small"
              />
            </Box>
            <Typography
              sx={{
                fontWeight: 600,
                color: "var(--foreground)",
                fontSize: { xs: 14, sm: 16 },
              }}
            >
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
                fontSize: { xs: 11, sm: 12 },
              }}
            />
            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreVertRoundedIcon fontSize="small" />
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
        <Box
          className="p-3 grid grid-cols-2 gap-3 text-sm"
          sx={{ flex: "1 1 auto" }}
        >
          {/* Temperature */}
          <Box
            sx={{
              border: "1px solid var(--border)",
              bgcolor: "var(--popover)",
              borderRadius: "var(--radius)",
              p: 2,
            }}
          >
            <Box className="flex items-center gap-1.5 mb-1">
              <ThermostatIcon
                sx={{ color: "var(--foreground)", fontSize: 18 }}
              />
              <Typography
                variant="caption"
                sx={{ 
                  color: "var(--muted-foreground)",
                  fontSize: 11,
                  lineHeight: 1,
                }}
              >
                Temperature
              </Typography>
            </Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 20,
                color: "var(--foreground)",
                lineHeight: 1.2,
              }}
            >
              {temperature.toFixed(1)}°C
            </Typography>
          </Box>

          {/* Humidity */}
          <Box
            sx={{
              border: "1px solid var(--border)",
              bgcolor: "var(--popover)",
              borderRadius: "var(--radius)",
              p: 2,
            }}
          >
            <Box className="flex items-center gap-1.5 mb-1">
              <OpacityIcon
                sx={{ color: "var(--foreground)", fontSize: 18 }}
              />
              <Typography
                variant="caption"
                sx={{ 
                  color: "var(--muted-foreground)",
                  fontSize: 11,
                  lineHeight: 1,
                }}
              >
                Humidity
              </Typography>
            </Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 20,
                color: "var(--foreground)",
                lineHeight: 1.2,
              }}
            >
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
              p: { xs: 2, sm: 3 },
            }}
          >
            <Box className="flex items-center gap-1.5">
              <TimelineRoundedIcon
                sx={{ color: "var(--muted-foreground)" }}
                fontSize="small"
              />
              <Typography
                variant="caption"
                sx={{ color: "var(--muted-foreground)" }}
              >
                Motion Status
              </Typography>
            </Box>
            <Typography
              sx={{
                mt: 0.5,
                fontWeight: 600,
                color: "var(--foreground)",
                fontSize: { xs: 14, sm: 16 },
              }}
            >
              {motionDetected ? "Motion Detected" : "No Motion"}
            </Typography>
          </Box>

          {/* Controls */}
          <Box 
            className="col-span-2"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: "1px solid var(--border)",
              bgcolor: "var(--popover)",
              borderRadius: "var(--radius)",
              px: 2.5,
              py: 1.5,
            }}
          >
            <Box className="flex items-center gap-2">
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: lightOn ? 'rgba(59, 130, 246, 0.1)' : 'var(--accent)',
                  transition: 'all 0.3s ease',
                }}
              >
                <LightbulbRoundedIcon
                  sx={{ 
                    color: lightOn ? '#3b82f6' : 'var(--muted-foreground)',
                    fontSize: 20,
                    transition: 'all 0.3s ease',
                  }}
                />
              </Box>
              <Typography
                sx={{ 
                  fontSize: 14,
                  color: 'var(--foreground)',
                  fontWeight: 600,
                }}
              >
                Light Control
              </Typography>
            </Box>
            
            <Box
              onClick={() => onLightControl(!lightOn)}
              sx={{
                width: 48,
                height: 26,
                borderRadius: 999,
                bgcolor: lightOn ? '#3b82f6' : '#cbd5e1',
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
            >
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  bgcolor: 'white',
                  position: 'absolute',
                  top: 3,
                  left: lightOn ? 25 : 3,
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
              />
            </Box>
          </Box>

          {/* Footer */}
          <Box className="col-span-2 flex items-center gap-1.5 flex-wrap">
            <AccessTimeRoundedIcon
              sx={{ fontSize: 18, color: "var(--muted-foreground)" }}
            />
            <Typography
              variant="caption"
              sx={{
                color: "var(--muted-foreground)",
                fontSize: { xs: 11, sm: 12 },
              }}
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