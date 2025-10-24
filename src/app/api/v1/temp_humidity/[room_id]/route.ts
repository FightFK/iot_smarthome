import { NextRequest, NextResponse } from "next/server";
import { supabaseClient } from "@/libs/supabaseClient";

export async function GET(
  request: NextRequest,
  { params }: { params: { room_id: string } }
) {
  try {
    const { room_id } = await params;

    const { data: records, error } = await supabaseClient
      .from("Temp_Humidity")
      .select("*")
      .eq("room_id", +room_id)
      .order("timestamp", { ascending: false });

    if (error) {
      console.error("❌ Supabase error:", error);
      return NextResponse.json(
        { message: "Error fetching records", error: error.message },
        { status: 500 }
      );
    }

    if (!records || records.length === 0) {
      return NextResponse.json(
        {
          message: "No records found for this room",
          room_id: room_id,
          count: 0,
          data: [],
        },
        { status: 200 }
      );
    }

    return NextResponse.json(records, { status: 200 });
  } catch (err) {
    console.error("💥 Unexpected error:", err);
    return NextResponse.json(
      { message: "Server error", error: err },
      { status: 500 }
    );
  }
}
