"use client";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export function DeleteRoomDialog({
  open,
  onOpenChange,
  onConfirmDelete,
  roomName,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConfirmDelete: () => void;
  roomName: string;
}) {
  return (
    <Dialog open={open} onClose={() => onOpenChange(false)} fullWidth maxWidth="xs">
      <DialogTitle>Delete Room</DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          Are you sure you want to remove <b>{roomName || "this room"}</b>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onOpenChange(false)}>Cancel</Button>
        <Button
          color="error"
          variant="contained"
          onClick={() => {
            onConfirmDelete();
            onOpenChange(false);
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
