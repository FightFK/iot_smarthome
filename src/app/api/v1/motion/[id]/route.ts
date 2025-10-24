import { NextResponse } from "next/server";
import { supabaseClient } from "@/libs/supabaseClient";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    console.log(id);
    const { data: motionData, error } = await supabaseClient
      .from("Motion")
      .select("*")
      .eq("room_id", Number(id))
      .order("time_motion", { ascending: false });

    if (error) {
      return NextResponse.json(
        { message: "Error fetching motion data", error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      motionData,
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}
