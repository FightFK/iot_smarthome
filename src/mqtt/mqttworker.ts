import "dotenv/config";
import mqtt from "mqtt";
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

  // ✅ When connected
  client.on("connect", async () => {
    console.log("✅ MQTT Connected");
    
    // Load room map after connection
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
  });

  // ❌ When error
  client.on("error", (err) => {
    console.error("❌ MQTT Error:", err);
  });

  // ⚠️ When disconnected
  client.on("offline", () => {
    console.warn("⚠️ MQTT Offline");
  });

  // 🔄 When reconnecting
  client.on("reconnect", () => {
    console.log("🔄 MQTT Reconnecting...");
  });

  // ✅ When receive message
  client.on("message", async (topic, message) => {
    try {
      const messageData = JSON.parse(message.toString());
      const match = topic.match(/home\/(.*?)\//);
      const roomKey = match ? match[1] : null;
      // console.log(messageData);
      if (!roomKey || !roomMap[roomKey]) {
        console.warn(`⚠️ Unknown room: ${roomKey}`);
        return;
      }

      const roomId = roomMap[roomKey];

      //  Insert Temp/Humidity data
      if (topic.includes("/data")) {
        const data = messageData as MqttSensorData;
        await supabaseServer.from("Temp_Humidity").insert({
          room_id: roomId,
          temp: data.temp,
          humidity: data.hum,
          timestamp: data.timestamp,
        });
        // console.log(`💾 Saved Temp/Humidity for ${roomKey}:`, data);
      }

      //  Insert Motion data
      if (topic.includes("/motion")) {
        const data = messageData as MqttMotionData;
        await supabaseServer.from("Motion").insert({
          room_id: roomId,
          time_motion: data.timestamp,
        });
        // console.log(`💾 Saved Motion for ${roomKey}:`, data);
      }
    } catch (err) {
      console.warn("⚠️ Error parsing or saving:", err);
    }
  });

  // Keep the process running
  process.on("SIGINT", () => {
    console.log("\n👋 Disconnecting MQTT...");
    client.end();
    process.exit(0);
  });
}

async function getRoomMap(): Promise<RoomMap> {
  const { data, error } = await supabaseServer.from("Room").select("room_id");
  if (error) throw error;

  const map: RoomMap = {};
  data.forEach((r) => {
    map[`room${r.room_id}`] = r.room_id;
  });
  return map;
}

// 🚀 Start worker
startMqttWorker();
