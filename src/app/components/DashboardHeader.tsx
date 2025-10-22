"use client";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

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
      sx={{ bgcolor: "rgba(255,255,255,0.8)", backdropFilter: "blur(8px)", borderBottom: "1px solid #e5e7eb" }}
    >
      <Toolbar sx={{ maxWidth: "80rem", width: "100%", mx: "auto" }}>
        <Typography variant="h6" sx={{ flexGrow: 1, color: "#0f172a" }}>
          Smart Home
        </Typography>
        <Box className="flex gap-2">
          <Button
            variant={currentPage === "dashboard" ? "contained" : "outlined"}
            size="small"
            onClick={() => onNavigate("dashboard")}
          >
            Dashboard
          </Button>
          <Button
            variant={currentPage === "history" ? "contained" : "outlined"}
            size="small"
            onClick={() => onNavigate("history")}
          >
            History
          </Button>
          <Chip
            color={isConnected ? "success" : "error"}
            label={isConnected ? "Connected" : "Disconnected"}
            size="small"
            variant="outlined"
            sx={{ ml: 1 }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
