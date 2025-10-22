"use client";

import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

export function AddRoomCard({ onAddRoom }: { onAddRoom: () => void }) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: "16px",
        border: "2px dashed #cbd5e1",
        bgcolor: "#f8fafc",
      }}
    >
      <CardActionArea
        onClick={onAddRoom}
        sx={{
          p: 5,
          display: "grid",
          placeItems: "center",
          gap: 1,
          color: "#0f172a",
        }}
      >
        <Box
          className="grid place-items-center"
          sx={{
            width: 56,
            height: 56,
            borderRadius: "16px",
            background: "linear-gradient(135deg,#f1f5f9,#e2e8f0)",
            border: "1px dashed #cbd5e1",
          }}
        >
          <AddRoundedIcon />
        </Box>
        <Typography sx={{ fontWeight: 600, mt: 1 }}>Add New Room</Typography>
        <Typography variant="caption" sx={{ color: "#94a3b8" }}>
          Expand your smart home
        </Typography>
      </CardActionArea>
    </Card>
  );
}
