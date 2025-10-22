import { NextResponse } from 'next/server';
import { supabaseClient } from '@/libs/supabaseClient';

export async function GET() {
    try {
        const { data: Room, error } = await supabaseClient
            .from('Room')
            .select('*');

        if (error) {
            return NextResponse.json(
                { message: "Error fetching rooms", error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { data: Room },
            { status: 200 }
        );
    } catch (err) {
        return NextResponse.json(
            { message: "Server error", error: err },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        if (!body.room_id || !body.room_name) {
            return NextResponse.json(
                { message: "Missing required fields: room_id and room_name" },
                { status: 400 }
            );
        }

        const { data, error } = await supabaseClient
            .from('Room')
            .insert({
                room_id: body.room_id,
                room_name: body.room_name
            })
            .select();

        if (error) {
            return NextResponse.json(
                { message: "Error creating room", error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Room created successfully", data },
            { status: 201 }
        );
    } catch (err) {
        return NextResponse.json(
            { message: "Server error", error: err },
            { status: 500 }
        );
    }
}


export async function PUT(request: Request) {
    try {
        const body = await request.json();
        
        if (!body.room_id || !body.room_name) {
            return NextResponse.json(
                { message: "Missing required fields: room_id and room_name" },
                { status: 400 }
            );
        }

        // Convert room_id to number explicitly
        const roomId = Number(body.room_id);
        
        if (isNaN(roomId)) {
            return NextResponse.json(
                { message: "room_id must be a valid number" },
                { status: 400 }
            );
        }

        const { data, error } = await supabaseClient
            .from('Room')
            .update({
                room_name: body.room_name
            })
            .eq('room_id', roomId)  // ใช้ตัวแปรที่ convert แล้ว
            .select();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { message: "Error updating room", error: error.message },
                { status: 500 }
            );
        }

        // Check if any row was updated
        if (!data || data.length === 0) {
            return NextResponse.json(
                { 
                    message: "No room found with the provided room_id or no changes made",
                    room_id: roomId
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Room updated successfully", data },
            { status: 200 }
        );
    } catch (err) {
        console.error('Unexpected error:', err);
        return NextResponse.json(
            { message: "Server error", error: err },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const body = await request.json();
        const room_id = Number(body.room_id);
        
        if (!room_id) {
            return NextResponse.json(
                { message: "Missing room_id parameter" },
                { status: 400 }
            );
        }

        
        const { data, error } = await supabaseClient
            .from('Room')
            .delete()
            .eq('room_id', room_id)
            .select();

        if (error) {
            return NextResponse.json(
                { message: "Error deleting room", error: error.message },
                { status: 500 }
            );
        }

        if (data.length === 0) {
            return NextResponse.json(
                { message: "Room not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Room deleted successfully", data },
            { status: 200 }
        );
    } catch (err) {
        return NextResponse.json(
            { message: "Server error", error: err },
            { status: 500 }
        );
    }
}

