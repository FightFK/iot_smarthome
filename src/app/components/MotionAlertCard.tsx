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
        borderRadius: "calc(var(--radius) + 4px)",
        border: "1px solid color-mix(in oklch, var(--destructive) 25%, var(--border))",
        bgcolor: "color-mix(in oklch, var(--destructive) 8%, var(--card))",
      }}
    >
      <CardContent sx={{ pt: 2 }}>
        <Box className="flex items-center justify-between mb-2">
          <Box className="flex items-center gap-2">
            <WarningAmberRoundedIcon
              sx={{ color: "color-mix(in oklch, var(--destructive) 70%, white)" }}
            />
            <Typography
              sx={{ fontWeight: 600, color: "color-mix(in oklch, var(--destructive) 55%, white)" }}
            >
              Motion Alert Center
            </Typography>
          </Box>
          <Chip
            label={`${recentMotions.length} Recent`}
            size="small"
            sx={{
              color: "var(--foreground)",
              borderColor:
                "color-mix(in oklch, var(--destructive) 40%, var(--border))",
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
                border:
                  "1px solid color-mix(in oklch, var(--destructive) 18%, var(--border))",
                bgcolor:
                  "color-mix(in oklch, var(--destructive) 5%, var(--card))",
                borderRadius: "calc(var(--radius) - 2px)",
                mb: 1,
                px: 1.5,
              }}
            >
              <SsidChartRoundedIcon
                sx={{
                  color: "color-mix(in oklch, var(--destructive) 70%, white)",
                  mr: 1,
                }}
                fontSize="small"
              />
              <ListItemText
                primary={m.roomName}
                secondary={m.timestamp}
                primaryTypographyProps={{
                  sx: { fontSize: 14, color: "var(--foreground)", fontWeight: 500 },
                }}
                secondaryTypographyProps={{
                  sx: { fontSize: 12, color: "var(--muted-foreground)" },
                }}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
