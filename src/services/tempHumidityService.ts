import api from "@/libs/axios";

export const getRoomTempHumidity = async (roomId: String) => {
  const res = await api.get(`/temp_humidity/${roomId}`);
  return res.data; 
};
