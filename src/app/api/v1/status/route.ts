import { NextResponse } from 'next/server';
import mqtt from 'mqtt';

// 🔹 GET /api/v1/status → ตรวจว่า MQTT ยังออนไลน์ไหม
export async function GET() {
  // โหลด config จาก .env.local
  const MQTT_HOST = process.env.MQTT_HOST!;
  const MQTT_PORT = parseInt(process.env.MQTT_PORT || '1883');
  const MQTT_USERNAME = process.env.MQTT_USERNAME!;
  const MQTT_PASSWORD = process.env.MQTT_PASSWORD!;

  if (!MQTT_HOST || !MQTT_USERNAME || !MQTT_PASSWORD) {
    return NextResponse.json(
      { alive: false, message: 'Missing MQTT configuration' },
      { status: 500 }
    );
  }

  // ใช้ Promise เพื่อรอผล ping
  return new Promise((resolve) => {
    const client = mqtt.connect({
      host: MQTT_HOST,
      port: MQTT_PORT,
      username: MQTT_USERNAME,
      password: MQTT_PASSWORD,
      connectTimeout: 3000, // timeout 3 วินาที
    });

    let resolved = false;

    // ถ้าเชื่อมต่อสำเร็จ
    client.on('connect', () => {
      console.log('✅ MQTT Broker is online');
      resolved = true;
      client.end();
      resolve(
        NextResponse.json({ alive: true, host: MQTT_HOST, port: MQTT_PORT }, { status: 200 })
      );
    });

    // ถ้าเชื่อมต่อไม่ได้
    client.on('error', (err) => {
      console.error('❌ MQTT ping failed:', err.message);
      if (!resolved) {
        resolved = true;
        client.end(true);
        resolve(
          NextResponse.json(
            { alive: false, message: err.message },
            { status: 500 }
          )
        );
      }
    });

    // ถ้า timeout ก็ถือว่าไม่ online
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        client.end(true);
        console.warn('⚠️ MQTT ping timeout');
        resolve(
          NextResponse.json(
            { alive: false, message: 'Ping timeout' },
            { status: 504 }
          )
        );
      }
    }, 3000);
  });
}
