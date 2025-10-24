"use client";

import { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import { ThemeToggle } from "./ThemeToggle";

type Props = {
  currentPage: "dashboard" | "history";
  onNavigate: (p: "dashboard" | "history") => void;
};

export function DashboardHeader({ currentPage, onNavigate }: Props) {
  const [mqttStatus, setMqttStatus] = useState(false);

  useEffect(() => {
    const checkMqttStatus = async () => {
      try {
        const response = await fetch('/api/v1/status');
        const data = await response.json();
        setMqttStatus(data.alive || false);
      } catch (error) {
        console.error('Failed to check MQTT status:', error);
        setMqttStatus(false);
      }
    };

    checkMqttStatus();
    const interval = setInterval(checkMqttStatus, 10000); // เช็คทุก 10 วินาที
    return () => clearInterval(interval);
  }, []);
  const NavBtn = ({
    tab,
    icon,
    label,
  }: {
    tab: "dashboard" | "history";
    icon: React.ReactNode;
    label: string;
  }) => (
    <Button
      onClick={() => onNavigate(tab)}
      startIcon={icon}
      size="small"
      sx={{
        borderRadius: 999,
        px: 2,
        color:
          currentPage === tab ? "var(--primary-foreground)" : "var(--foreground)",
        bgcolor: currentPage === tab ? "var(--primary)" : "transparent",
        border: "1px solid var(--border)",
        "&:hover": {
          bgcolor:
            currentPage === tab
              ? "color-mix(in oklch, var(--primary) 92%, black)"
              : "color-mix(in oklch, var(--accent) 60%, transparent)",
          borderColor: "var(--border)",
        },
      }}
    >
      {label}
    </Button>
  );

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "color-mix(in oklch, var(--card) 88%, transparent)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <Toolbar sx={{ maxWidth: "80rem", width: "100%", mx: "auto", py: 1 }}>
        <Box className="flex items-center gap-3" sx={{ flexGrow: 1 }}>
          <Box
            className="grid place-items-center"
            sx={{
              width: 40,
              height: 40,
              borderRadius: "calc(var(--radius) - 2px)",
              background: "var(--accent)",
              border: "1px solid var(--border)",
            }}
          >
            <HomeRoundedIcon sx={{ color: "var(--primary)" }} fontSize="small" />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, color: "var(--foreground)" }}>
              Smart Home IoT Dashboard
            </Typography>
            <Typography variant="caption" sx={{ color: "var(--muted-foreground)" }}>
              University Student Project
            </Typography>
          </Box>
        </Box>

        <Box className="flex items-center gap-2">
          <NavBtn tab="dashboard" icon={<HomeRoundedIcon />} label="Dashboard" />
          <NavBtn tab="history" icon={<HistoryRoundedIcon />} label="History" />

          <Box
            sx={{
              ml: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 0.5,
              borderRadius: 999,
              bgcolor: mqttStatus
                ? "rgba(34, 197, 94, 0.1)"
                : "rgba(239, 68, 68, 0.1)",
              border: `1px solid ${mqttStatus ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            }}
          >
            {/* สัญญาณ 3 ขีด แบบมีชีวิต */}
            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'flex-end' }}>
              <Box
                sx={{
                  width: 3,
                  height: 8,
                  bgcolor: mqttStatus ? '#22c55e' : '#ef4444',
                  borderRadius: 1,
                  animation: mqttStatus ? 'pulse-bar 1.2s ease-in-out infinite' : 'none',
                  '@keyframes pulse-bar': {
                    '0%, 100%': { height: '8px', opacity: 0.4 },
                    '50%': { height: '14px', opacity: 1 },
                  },
                }}
              />
              <Box
                sx={{
                  width: 3,
                  height: 10,
                  bgcolor: mqttStatus ? '#22c55e' : '#ef4444',
                  borderRadius: 1,
                  animation: mqttStatus ? 'pulse-bar 1.2s ease-in-out 0.2s infinite' : 'none',
                  '@keyframes pulse-bar': {
                    '0%, 100%': { height: '10px', opacity: 0.4 },
                    '50%': { height: '16px', opacity: 1 },
                  },
                }}
              />
              <Box
                sx={{
                  width: 3,
                  height: 12,
                  bgcolor: mqttStatus ? '#22c55e' : '#ef4444',
                  borderRadius: 1,
                  animation: mqttStatus ? 'pulse-bar 1.2s ease-in-out 0.4s infinite' : 'none',
                  '@keyframes pulse-bar': {
                    '0%, 100%': { height: '12px', opacity: 0.4 },
                    '50%': { height: '18px', opacity: 1 },
                  },
                }}
              />
            </Box>
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 600,
                color: mqttStatus ? '#22c55e' : '#ef4444',
              }}
            >
              {mqttStatus ? 'Connected' : 'Disconnected'}
            </Typography>
          </Box>

          <ThemeToggle />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
