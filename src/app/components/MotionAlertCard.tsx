"use client";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

type MotionEvent = { id: number; roomName: string; timestamp: string };

export function MotionAlertCard({ recentMotions }: { recentMotions: MotionEvent[] }) {
  return (
    <Card elevation={0} sx={{ borderRadius: "14px", border: "1px solid #e5e7eb" }}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
          Motion Alert Center
        </Typography>
        <List dense disablePadding>
          {recentMotions.map((m) => (
            <ListItem
              key={m.id}
              sx={{
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                mb: 1,
                px: 1.5,
              }}
            >
              <ListItemText
                primary={m.roomName}
                secondary={m.timestamp}
                primaryTypographyProps={{ sx: { fontSize: 14, color: "#0f172a" } }}
                secondaryTypographyProps={{ sx: { fontSize: 12, color: "#64748b" } }}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
