"use client";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import SsidChartRoundedIcon from "@mui/icons-material/SsidChartRounded";

type MotionEvent = { id: number; roomName: string; timestamp: string };

export function MotionAlertCard({ recentMotions }: { recentMotions: MotionEvent[] }) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: "16px",
        border: "1px solid #fde7d9",
        bgcolor: "#fff7ed",
        boxShadow: "0 2px 12px rgba(249,115,22,.08)",
      }}
    >
      <CardContent sx={{ pt: 2 }}>
        <Box className="flex items-center justify-between mb-2">
          <Box className="flex items-center gap-2">
            <WarningAmberRoundedIcon sx={{ color: "#f97316" }} />
            <Typography sx={{ fontWeight: 600, color: "#b45309" }}>
              Motion Alert Center
            </Typography>
          </Box>
          <Chip
            label={`${recentMotions.length} Recent`}
            size="small"
            sx={{
              color: "#ea580c",
              borderColor: "#fdba74",
              bgcolor: "transparent",
              border: "1px solid",
              height: 24,
              borderRadius: 999,
            }}
            variant="outlined"
          />
        </Box>

        <List dense disablePadding>
          {recentMotions.map((m) => (
            <ListItem
              key={m.id}
              sx={{
                border: "1px solid #fde7d9",
                bgcolor: "rgba(253,230,138,.15)",
                borderRadius: "10px",
                mb: 1,
                px: 1.5,
              }}
            >
              <SsidChartRoundedIcon sx={{ color: "#fb923c", mr: 1 }} fontSize="small" />
              <ListItemText
                primary={m.roomName}
                secondary={m.timestamp}
                primaryTypographyProps={{ sx: { fontSize: 14, color: "#0f172a", fontWeight: 500 } }}
                secondaryTypographyProps={{ sx: { fontSize: 12, color: "#64748b" } }}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
