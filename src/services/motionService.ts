import api from "@/libs/axios";

export const getRoomMotion = async (roomId: number) => {
  const res = await api.get(`/motion/${roomId}`);
  return res.data;
};
