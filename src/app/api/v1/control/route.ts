import { NextRequest, NextResponse } from "next/server";
import mqtt from "mqtt";

// POST /api/v1/control
export async function POST(req: NextRequest) {
  try {
    const { roomId, command } = await req.json();

    if (!roomId || !command) {
      return NextResponse.json(
        { error: "roomId and command are required" },
        { status: 400 }
      );
    }

    if (command !== "ON" && command !== "OFF") {
      return NextResponse.json(
        { error: "command must be 'ON' or 'OFF'" },
        { status: 400 }
      );
    }

    // Connect to MQTT
    const client = mqtt.connect(
      `mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`,
      {
        username: process.env.MQTT_USERNAME,
        password: process.env.MQTT_PASSWORD,
        connectTimeout: 5000,
      }
    );

    // Publish command
    await new Promise<void>((resolve, reject) => {
      client.on("connect", () => {
        const topic = `home/${roomId}/control`;
        client.publish(topic, command, { qos: 1 }, (err) => {
          if (err) {
            console.error("❌ MQTT Publish error:", err);
            reject(err);
          } else {
            console.log(`✅ Published to ${topic}: ${command}`);
            client.end();
            resolve();
          }
        });
      });

      client.on("error", (err) => {
        console.error("❌ MQTT Connection error:", err);
        reject(err);
      });

      // Timeout after 5 seconds
      setTimeout(() => {
        client.end();
        reject(new Error("MQTT connection timeout"));
      }, 5000);
    });

    return NextResponse.json({
      success: true,
      message: `Command ${command} sent to room ${roomId}`,
    });
  } catch (error) {
    console.error("❌ Control API error:", error);
    return NextResponse.json(
      { error: "Failed to send command" },
      { status: 500 }
    );
  }
}
