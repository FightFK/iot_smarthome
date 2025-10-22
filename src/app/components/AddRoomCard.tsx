"use client";

import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";

export function AddRoomCard({ onAddRoom }: { onAddRoom: () => void }) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: "14px",
        border: "1px dashed #cbd5e1",
        bgcolor: "#ffffff",
      }}
    >
      <CardActionArea
        onClick={onAddRoom}
        sx={{ p: 4, display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        + Add Room
      </CardActionArea>
    </Card>
  );
}
