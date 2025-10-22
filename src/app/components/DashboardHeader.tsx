"use client";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import WifiRoundedIcon from "@mui/icons-material/WifiRounded";
import { ThemeToggle } from "./ThemeToggle";

type Props = {
  currentPage: "dashboard" | "history";
  onNavigate: (p: "dashboard" | "history") => void;
  isConnected: boolean;
};

export function DashboardHeader({ currentPage, onNavigate, isConnected }: Props) {
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

          <Chip
            icon={<WifiRoundedIcon />}
            label={isConnected ? "Connected" : "Disconnected"}
            size="small"
            sx={{
              ml: 1,
              borderRadius: 999,
              bgcolor: isConnected
                ? "color-mix(in oklch, var(--secondary) 35%, var(--card))"
                : "color-mix(in oklch, var(--muted) 55%, var(--card))",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
            }}
            variant="filled"
          />

          <ThemeToggle />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
