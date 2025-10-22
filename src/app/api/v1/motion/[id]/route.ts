import { NextResponse } from "next/server";
import { supabaseClient } from "@/libs/supabaseClient";

interface Params {
  params: {
    id: string; // รับค่าพารามิเตอร์จาก URL
  };
}

export async function GET(request: Request, { params }: Params) {
  try {
    const timeParam = decodeURIComponent(params.id);
    const { data: Motion, error } = await supabaseClient
      .from("Motion")
      .select("*")
      .eq("time_motion", timeParam) // ใช้ชื่อคอลัมน์จริง
      .single(); // ใช้ .single() เพื่อให้ได้เพียงแถวเดียว;

    if (error) {
      return NextResponse.json(
        { message: "Error fetching rooms", error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Success", data: Motion },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Server error", error: err },
      { status: 500 }
    );
  }
}
