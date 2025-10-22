import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from '@/libs/supabaseClient';

// GET /api/temp-humidity/123 (โดย 123 คือ room_id)
export async function GET(
  request: NextRequest,
  { params }: { params: { room_id: string } }  // ← เปลี่ยนเป็น room_id
) {
  try {
    const {room_id} = params;
    
    console.log('🔍 Fetching records with room_id:', room_id);

    const { data: records, error } = await supabaseClient
      .from('Temp_Humidity')
      .select('*')
      .eq('room_id', +room_id);

    if (error) {
      console.error('❌ Supabase error:', error);
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
          count: 0
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        message: "Success", 
        data: records,
        count: records.length
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('💥 Unexpected error:', err);
    return NextResponse.json(
      { message: "Server error", error: err },
      { status: 500 }
    );
  }
}