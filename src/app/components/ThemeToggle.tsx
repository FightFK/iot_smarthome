"use client";

import { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // โหลดธีมจาก localStorage
  useEffect(() => {
    const current = localStorage.getItem("theme") as "light" | "dark" | null;
    if (current === "dark") {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    }
  }, []);

  // toggle โหมด
  const toggleTheme = () => {
    if (theme === "light") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setTheme("light");
    }
  };

  return (
    <IconButton
      onClick={toggleTheme}
      sx={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        border: "1px solid var(--border)",
        bgcolor: "var(--accent)",
        color:
          theme === "dark"
            ? "var(--foreground)" 
            : "var(--foreground)", 
        "&:hover": {
          bgcolor: "color-mix(in oklch, var(--accent) 80%, black)",
        },
      }}
    >
      {theme === "dark" ? (
        <LightModeRoundedIcon sx={{ color: "white" }} /> 
      ) : (
        <DarkModeRoundedIcon sx={{ color: "#030213" }} /> 
      )}
    </IconButton>
  );
}
