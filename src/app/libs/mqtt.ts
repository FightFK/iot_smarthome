import mqtt from "mqtt";
import { supabaseServer } from "./supabaseServer";

export async function initMqttClient() {
  const roomMap = await getRoomMap();

  const client = mqtt.connect(`mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`, {
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
  });

  client.on("connect", () => {
    //console.log("✅ MQTT Connected");
    //console.log("🗺️ Subscribing to topics for rooms:", Object.keys(roomMap));
    Object.keys(roomMap).forEach((room) => {
      client.subscribe(`home/${room}/data`);
      client.subscribe(`home/${room}/motion`);
      //console.log(`📡 Subscribing to home/${room}/data and home/${room}/motion`);

    });
  });

  client.on("message", async (topic, message) => {
    // console.log(`📩 Raw message on ${topic}: ${message.toString()}`);
    let data;
    try {
      data = JSON.parse(message.toString());
    } catch (err) {
      console.warn("⚠️ Invalid JSON payload:", message.toString());
      return;
    }

    const match = topic.match(/home\/(.*?)\//);
    const roomKey = match ? match[1] : null;
    if (!roomKey) return console.warn(`⚠️ Cannot parse room key from topic: ${topic}`);

    const roomId = roomMap[roomKey];
    if (!roomId) return console.warn(`⚠️ Unknown room name: ${roomKey}`);

    //console.log(`🏠 Room: ${roomKey} (ID: ${roomId})`);
    //console.log(`🌡️ Temp: ${data.temp} | 💧 Hum: ${data.hum} | 🕒 ${data.timestamp}`);
  });

  return client;
}


async function getRoomMap() {
  const { data, error } = await supabaseServer.from("Room").select("room_id");
  //console.log("data", data);
  if (error) throw error;

  const map: Record<string, number> = {};
  data.forEach((r) => {
    map[`room${r.room_id}`] = r.room_id;
  });
  return map;
}

