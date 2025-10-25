import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/libs/supabaseServer";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get("roomId");
    const hours = parseInt(searchParams.get("hours") || "24");

    // คำนวณเวลาย้อนหลัง
    const startTime = new Date();
    startTime.setHours(startTime.getHours() - hours);

    let tempHumQuery = supabaseServer
      .from("Temp_Humidity")
      .select("room_id, temp, humidity, timestamp")
      .gte("timestamp", startTime.toISOString())
      .order("timestamp", { ascending: true });

    let motionQuery = supabaseServer
      .from("Motion")
      .select(`
        room_id,
        time_motion,
        Room(room_name)
      `)
      .gte("time_motion", startTime.toISOString())
      .order("time_motion", { ascending: false })
      .limit(50);

    // ถ้าระบุ roomId ให้ filter
    if (roomId && roomId !== "all") {
      const roomIdNum = parseInt(roomId);
      tempHumQuery = tempHumQuery.eq("room_id", roomIdNum);
      motionQuery = motionQuery.eq("room_id", roomIdNum);
    }

    const [tempHumRes, motionRes] = await Promise.all([
      tempHumQuery,
      motionQuery,
    ]);

    if (tempHumRes.error) throw tempHumRes.error;
    if (motionRes.error) throw motionRes.error;

    return NextResponse.json({
      tempHumidity: tempHumRes.data,
      motion: motionRes.data,
    });
  } catch (error: any) {
    console.error("Error fetching history data:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch history data" },
      { status: 500 }
    );
  }
}
