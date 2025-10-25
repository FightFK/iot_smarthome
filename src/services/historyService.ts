const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

export interface TempHumidityData {
  room_id: number;
  temp: number;
  humidity: number;
  timestamp: string;
}

export interface MotionData {
  room_id: number;
  time_motion: string;
  Room: {
    room_name: string;
  } | null;
}

export interface HistoryData {
  tempHumidity: TempHumidityData[];
  motion: MotionData[];
}

export async function getHistoryData(
  roomId: number | "all" = "all",
  hours: number = 24
): Promise<HistoryData> {
  const params = new URLSearchParams({
    roomId: String(roomId),
    hours: String(hours),
  });

  const response = await fetch(`${API_BASE_URL}/history?${params}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("History API error:", response.status, errorText);
    throw new Error(`Failed to fetch history data: ${response.status}`);
  }

  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text();
    console.error("Non-JSON response:", text);
    throw new Error("API returned non-JSON response");
  }

  return response.json();
}
