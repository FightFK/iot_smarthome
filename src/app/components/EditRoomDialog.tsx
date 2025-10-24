"use client";

import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

export function EditRoomDialog({
  open,
  onOpenChange,
  onEditRoom,
  currentName,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onEditRoom: (newName: string) => void;
  currentName: string;
}) {
  const [name, setName] = useState(currentName);
  useEffect(() => setName(currentName), [currentName, open]);

  return (
    <Dialog open={open} onClose={() => onOpenChange(false)} fullWidth maxWidth="xs">
      <DialogTitle>Rename Room</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          fullWidth
          size="small"
          label="New name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onOpenChange(false)}>Cancel</Button>
        <Button
          variant="contained"
          disabled={!name.trim() || name === currentName}
          onClick={() => {
            onEditRoom(name.trim());
            onOpenChange(false);
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
