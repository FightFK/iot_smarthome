"use client";

import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

export function AddRoomDialog({
  open,
  onOpenChange,
  onAddRoom,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onAddRoom: (name: string) => void;
}) {
  const [name, setName] = useState("");
  useEffect(() => {
    if (!open) setName("");
  }, [open]);

  return (
    <Dialog open={open} onClose={() => onOpenChange(false)} fullWidth maxWidth="xs">
      <DialogTitle>Add Room</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          fullWidth
          size="small"
          label="Room name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onOpenChange(false)}>Cancel</Button>
        <Button
          variant="contained"
          disabled={!name.trim()}
          onClick={() => {
            onAddRoom(name.trim());
            onOpenChange(false);
          }}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
