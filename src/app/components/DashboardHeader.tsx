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

type Props = {
  currentPage: "dashboard" | "history";
  onNavigate: (p: "dashboard" | "history") => void;
  isConnected: boolean;
};

export function DashboardHeader({ currentPage, onNavigate, isConnected }: Props) {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <Toolbar sx={{ maxWidth: "80rem", width: "100%", mx: "auto", py: 1 }}>
        {/* Logo + Title */}
        <Box className="flex items-center gap-3" sx={{ flexGrow: 1 }}>
          <Box
            className="grid place-items-center"
            sx={{
              width: 40,
              height: 40,
              borderRadius: "12px",
              background:
                "linear-gradient(135deg, rgba(59,130,246,.12), rgba(14,165,233,.12))",
              border: "1px solid #e5e7eb",
            }}
          >
            <HomeRoundedIcon sx={{ color: "#2563eb" }} fontSize="small" />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, color: "#0f172a" }}>
              Smart Home IoT Dashboard
            </Typography>
            <Typography variant="caption" sx={{ color: "#94a3b8" }}>
              University Student Project
            </Typography>
          </Box>
        </Box>

        {/* Nav */}
        <Box className="flex items-center gap-2">
          <Button
            onClick={() => onNavigate("dashboard")}
            startIcon={<HomeRoundedIcon />}
            size="small"
            sx={{
              borderRadius: 999,
              px: 2,
              bgcolor: currentPage === "dashboard" ? "#0f172a" : "transparent",
              color: currentPage === "dashboard" ? "white" : "#0f172a",
              border: "1px solid #0f172a",
              "&:hover": {
                bgcolor: currentPage === "dashboard" ? "#0b1220" : "rgba(15,23,42,.06)",
                borderColor: "#0f172a",
              },
            }}
          >
            Dashboard
          </Button>
          <Button
            onClick={() => onNavigate("history")}
            startIcon={<HistoryRoundedIcon />}
            size="small"
            sx={{
              borderRadius: 999,
              px: 2,
              bgcolor: currentPage === "history" ? "#0f172a" : "transparent",
              color: currentPage === "history" ? "white" : "#0f172a",
              border: "1px solid #0f172a",
              "&:hover": {
                bgcolor: currentPage === "history" ? "#0b1220" : "rgba(15,23,42,.06)",
                borderColor: "#0f172a",
              },
            }}
          >
            History
          </Button>

          <Chip
            icon={<WifiRoundedIcon />}
            color={isConnected ? "success" : "default"}
            label={isConnected ? "Connected" : "Disconnected"}
            size="small"
            sx={{
              ml: 1,
              borderRadius: 999,
              bgcolor: isConnected ? "rgba(16,185,129,.15)" : "rgba(148,163,184,.2)",
              color: isConnected ? "#065f46" : "#334155",
            }}
            variant="filled"
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
