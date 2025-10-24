"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import GitHubIcon from "@mui/icons-material/GitHub";
import FavoriteIcon from "@mui/icons-material/Favorite";

// ดึง version จาก package.json
const packageJson = require("../../../package.json");

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        borderTop: "1px solid var(--border)",
        bgcolor: "var(--card)",
        py: 4,
        mt: 8,
      }}
    >
      <Box
        sx={{
          maxWidth: "80rem",
          mx: "auto",
          px: { xs: 2, md: 4 },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        {/* Left Section */}
        <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
          <Typography
            sx={{
              fontSize: 14,
              color: "var(--muted-foreground)",
              display: "flex",
              alignItems: "center",
              justifyContent: { xs: "center", md: "flex-start" },
              gap: 0.5,
            }}
          >
            Made with{" "}
            <FavoriteIcon sx={{ fontSize: 16, color: "#ef4444" }} /> by
            University Students
          </Typography>
          <Typography
            sx={{
              fontSize: 12,
              color: "var(--muted-foreground)",
              mt: 0.5,
            }}
          >
            © {currentYear} Smart Home IoT Dashboard. All rights reserved.
          </Typography>
        </Box>

        {/* Center Section - Version */}
        <Box
          sx={{
            px: 2,
            py: 0.5,
            borderRadius: 999,
            bgcolor: "var(--accent)",
            border: "1px solid var(--border)",
          }}
        >
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--muted-foreground)",
            }}
          >
            v{packageJson.version}
          </Typography>
        </Box>

        {/* Right Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Link
            href="https://github.com/FightFK/iot_smarthome"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: "var(--muted-foreground)",
              textDecoration: "none",
              fontSize: 14,
              transition: "color 0.2s",
              "&:hover": {
                color: "var(--foreground)",
              },
            }}
          >
            <GitHubIcon sx={{ fontSize: 18 }} />
            <Typography sx={{ fontSize: 14 }}>GitHub</Typography>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
