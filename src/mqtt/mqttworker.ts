import "dotenv/config";
import mqtt from "mqtt";
import { WebSocketServer } from "ws";
import { supabaseServer } from "@/libs/supabaseServer";
import type {
  MqttSensorData,
  MqttMotionData,
  RoomMap,
} from "@/types/mqtt.types";

function startMqttWorker() {
  console.log("🔌 Connecting to MQTT broker...");
  console.log(`📍 Host: ${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`);
  console.log(`👤 Username: ${process.env.MQTT_USERNAME}`);

  // สร้าง WebSocket Server สำหรับส่งข้อมูล real-time
  const wss = new WebSocketServer({ port: 8080 });
  console.log("🌐 WebSocket server started on port 8080");

  const client = mqtt.connect(`mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`, {
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    connectTimeout: 30000,
    reconnectPeriod: 1000,
    keepalive: 60,
    clean: true,
  });

  console.log("⏳ Waiting for connection...");

  let roomMap: RoomMap = {};

  // Save Data Buffers (สำหรับบันทึก DB ทุก 30 นาที)
  let bufferTempHum: any[] = [];
  // Motion จะบันทึกทันทีเมื่อมีคนเดินผ่าน ไม่ใช้ buffer

  // เก็บข้อมูลล่าสุดสำหรับแต่ละห้อง (สำหรับ WebSocket clients ที่เพิ่ง connect)
  const latestData: { [key: string]: any } = {};

  // ฟังก์ชันส่งข้อมูลไปยัง WebSocket clients ทั้งหมด
  const broadcastToClients = (data: any) => {
    const message = JSON.stringify(data);
    wss.clients.forEach((client) => {
      if (client.readyState === 1) { // OPEN state
        client.send(message);
      }
    });
  };

  // When Connected
  client.on("connect", async () => {
    console.log("✅ MQTT Connected");

    roomMap = await getRoomMap();
    console.log("🗺️ Room map:", roomMap);

    Object.keys(roomMap).forEach((room) => {
      client.subscribe(`home/${room}/data`, (err) => {
        if (err) console.error(`❌ Subscribe error (${room}/data):`, err);
        else console.log(`📥 Subscribed to home/${room}/data`);
      });
      client.subscribe(`home/${room}/motion`, (err) => {
        if (err) console.error(`❌ Subscribe error (${room}/motion):`, err);
        else console.log(`📥 Subscribed to home/${room}/motion`);
      });
    });

    // ตั้ง interval ให้บันทึก Temp/Humidity ทุก 30 นาที
    setInterval(async () => {
      try {
        if (bufferTempHum.length > 0) {
          console.log(`💾 Saving ${bufferTempHum.length} Temp/Humidity records to DB...`);
          await supabaseServer.from("Temp_Humidity").insert(bufferTempHum);
          bufferTempHum = [];
        }
        // Motion ไม่ใช้ buffer แล้ว - บันทึกทันทีเมื่อมีคนเดินผ่าน
      } catch (err) {
        console.error("❌ Error during batch insert:", err);
      }
    }, 30 * 60 * 1000); // 30 minutes
  });

  // เมื่อมีข้อความเข้ามาจาก MQTT
  client.on("message", async (topic, message) => {
    try {
      const messageData = JSON.parse(message.toString());
      const match = topic.match(/home\/(.*?)\//);
      const roomKey = match ? match[1] : null;
      if (!roomKey || !roomMap[roomKey]) {
        console.warn(`⚠️ Unknown room: ${roomKey}`);
        return;
      }

      const roomId = roomMap[roomKey];

      if (topic.includes("/data")) {
        const data = messageData as MqttSensorData;
        
        // เก็บใน buffer สำหรับบันทึก DB ทุก 30 นาที
        bufferTempHum.push({
          room_id: roomId,
          temp: data.temp,
          humidity: data.hum,
          timestamp: data.timestamp,
        });

        // อัพเดทข้อมูลล่าสุด
        latestData[`room_${roomId}`] = {
          type: "sensor",
          roomId,
          temp: data.temp,
          humidity: data.hum,
          timestamp: data.timestamp,
        };

        // ส่งข้อมูล real-time ไปยัง WebSocket clients
        broadcastToClients(latestData[`room_${roomId}`]);
        console.log(`📊 Real-time: Room ${roomId} - Temp: ${data.temp}°C, Humidity: ${data.hum}%`);
      }

      if (topic.includes("/motion")) {
        const data = messageData as MqttMotionData;
        
        // ⚡ บันทึก Motion ลง DB ทันทีเมื่อมีคนเดินผ่าน (ไม่รอ 30 นาที)
        try {
          await supabaseServer.from("Motion").insert({
            room_id: roomId,
            time_motion: data.timestamp,
          });
          console.log(`💾 Motion saved immediately - Room ${roomId}`);
        } catch (err) {
          console.error("❌ Error saving motion:", err);
        }

        // ดึงชื่อห้อง
        const roomName = await getRoomName(roomId);

        // ส่งข้อมูล motion real-time ไปยัง WebSocket clients
        const motionData = {
          type: "motion",
          roomId,
          roomName, // เพิ่มชื่อห้องเพื่อแสดง notification
          timestamp: data.timestamp,
        };
        
        latestData[`motion_${roomId}`] = motionData;
        broadcastToClients(motionData);
        console.log(`🚶 Real-time: ${roomName} - Motion detected at ${data.timestamp}`);
      }
    } catch (err) {
      console.warn("⚠️ Error parsing or buffering:", err);
    }
  });

  // เมื่อมี WebSocket client เชื่อมต่อ
  wss.on("connection", (ws) => {
    console.log("👤 New WebSocket client connected");

    // ส่งข้อมูลล่าสุดทั้งหมดให้ client ที่เพิ่ง connect
    ws.send(JSON.stringify({
      type: "initial",
      data: latestData,
    }));

    ws.on("close", () => {
      console.log("👋 WebSocket client disconnected");
    });

    ws.on("error", (error) => {
      console.error("❌ WebSocket client error:", error);
    });
  });

  // เมื่อมี client ส่งข้อความมา (สำหรับอนาคต เช่น control commands)
  wss.on("message", (ws, message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log("📨 Received from WebSocket client:", data);
    } catch (err) {
      console.error("❌ Error parsing WebSocket message:", err);
    }
  });

  process.on("SIGINT", async () => {
    console.log("\n👋 Flushing buffers before exit...");
    try {
      if (bufferTempHum.length > 0)
        await supabaseServer.from("Temp_Humidity").insert(bufferTempHum);
      // Motion ไม่มี buffer แล้ว - บันทึกทันที
    } catch (err) {
      console.error("❌ Error flushing buffers:", err);
    }
    client.end();
    wss.close();
    process.exit(0);
  });
}

async function getRoomMap(): Promise<RoomMap> {
  const { data, error } = await supabaseServer.from("Room").select("room_id, room_name");
  if (error) throw error;
  const map: RoomMap = {};
  data.forEach((r) => {
    map[`room${r.room_id}`] = r.room_id;
  });
  return map;
}

// เพิ่มฟังก์ชันดึงชื่อห้อง
async function getRoomName(roomId: number): Promise<string> {
  const { data, error } = await supabaseServer
    .from("Room")
    .select("room_name")
    .eq("room_id", roomId)
    .single();
  
  if (error || !data) return `Room ${roomId}`;
  return data.room_name;
}

// 🚀 Start worker
startMqttWorker();
