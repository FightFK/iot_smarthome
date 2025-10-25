"use client";

import { useState, useEffect, useCallback } from "react";

interface SensorData {
  type: "sensor";
  roomId: number;
  temp: number;
  humidity: number;
  timestamp: string;
}

interface MotionData {
  type: "motion";
  roomId: number;
  roomName: string;
  timestamp: string;
}

type RealtimeMessage = SensorData | MotionData | {
  type: "initial";
  data: { [key: string]: any };
};

export function useRealtimeData(wsUrl: string = "ws://localhost:8080") {
  const [realtimeData, setRealtimeData] = useState<{ [key: string]: any }>({});
  const [isConnected, setIsConnected] = useState(false);
  const [latestMotion, setLatestMotion] = useState<MotionData | null>(null);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      try {
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          console.log("🌐 WebSocket connected");
          setIsConnected(true);
        };

        ws.onmessage = (event) => {
          try {
            const message: RealtimeMessage = JSON.parse(event.data);

            if (message.type === "initial") {
              // ข้อมูลเริ่มต้นทั้งหมด
              console.log("📦 Received initial data:", message.data);
              setRealtimeData(message.data);
            } else if (message.type === "sensor") {
              // อัพเดทข้อมูล sensor
              const sensorMsg = message as SensorData;
              console.log(`📊 Sensor update - Room ${sensorMsg.roomId}:`, sensorMsg);
              setRealtimeData((prev) => ({
                ...prev,
                [`room_${sensorMsg.roomId}`]: sensorMsg,
              }));
            } else if (message.type === "motion") {
              // อัพเดทข้อมูล motion
              const motionMsg = message as MotionData;
              console.log(`🚶 Motion detected - Room ${motionMsg.roomId}: ${motionMsg.roomName}`);
              setRealtimeData((prev) => ({
                ...prev,
                [`motion_${motionMsg.roomId}`]: motionMsg,
              }));
              // เก็บ motion ล่าสุดเพื่อแสดง notification
              setLatestMotion(motionMsg);
            }
          } catch (err) {
            console.error("❌ Error parsing WebSocket message:", err);
          }
        };

        ws.onerror = (error) => {
          console.error("❌ WebSocket error:", error);
        };

        ws.onclose = () => {
          console.log("🔌 WebSocket disconnected, reconnecting in 3 seconds...");
          setIsConnected(false);
          // Reconnect after 3 seconds
          reconnectTimeout = setTimeout(connect, 3000);
        };
      } catch (err) {
        console.error("❌ Failed to create WebSocket:", err);
        reconnectTimeout = setTimeout(connect, 3000);
      }
    };

    connect();

    return () => {
      if (ws) {
        ws.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, [wsUrl]);

  // ดึงข้อมูล sensor ล่าสุดของห้อง
  const getLatestSensorData = useCallback(
    (roomId: number) => {
      const data = realtimeData[`room_${roomId}`];
      if (data && data.type === "sensor") {
        return {
          temp: data.temp,
          humidity: data.humidity,
          timestamp: data.timestamp,
        };
      }
      return null;
    },
    [realtimeData]
  );

  // ตรวจสอบว่ามี motion หรือไม่
  const hasMotion = useCallback(
    (roomId: number) => {
      const data = realtimeData[`motion_${roomId}`];
      if (data && data.type === "motion") {
        // ตรวจสอบว่า motion เกิดขึ้นภายใน 1 นาทีหรือไม่
        const motionTime = new Date(data.timestamp).getTime();
        const now = new Date().getTime();
        const diff = now - motionTime;
        return diff < 60 * 1000; // ถ้าเกิดภายใน 1 นาที ถือว่ามี motion
      }
      return false;
    },
    [realtimeData]
  );

  return {
    realtimeData,
    isConnected,
    getLatestSensorData,
    hasMotion,
    latestMotion, // ส่งออก motion ล่าสุดเพื่อแสดง notification
  };
}
