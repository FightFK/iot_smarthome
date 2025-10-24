import api from "@/libs/axios";

export const getRooms = async () => {
  const res = await api.get("/room");
  return res.data; 
};

export const addRoom = async (roomName: string) => {
  const rooms = await getRooms();
  const maxId = rooms.length > 0 ? Math.max(...rooms.map((r: any) => r.room_id)) : 0;
  const nextId = maxId + 1;
  
  const res = await api.post("/room", { 
    room_id: nextId,
    room_name: roomName 
  });
  return res.data.data; 
};

export const updateRoom = async (roomId: number, newName: string) => {
  const res = await api.put(`/room`, { 
    room_id: roomId,
    room_name: newName 
  });
  return res.data.data; 
};

export const deleteRoom = async (roomId: number) => {
  const res = await api.delete(`/room`, {
    data: { room_id: roomId }
  });
  return res.data; 
};
