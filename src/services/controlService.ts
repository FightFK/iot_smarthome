import axiosInstance from "@/libs/axios";

export const sendLightControl = async (
  roomId: number,
  command: "ON" | "OFF"
) => {
  try {
    const response = await axiosInstance.post("/control", {
      roomId,
      command,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to send light control:", error);
    throw error;
  }
};
