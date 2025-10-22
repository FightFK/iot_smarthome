import { NextResponse } from 'next/server';
import { supabaseClient } from '@/libs/supabaseClient';

export async function GET() {
    try {
        const { data: Room, error } = await supabaseClient
            .from('Temp_Humidity')
            .select('*');

        if (error) {
            return NextResponse.json(
                { message: "Error fetching rooms", error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Success", data: Room },
            { status: 200 }
        );
    } catch (err) {
        return NextResponse.json(
            { message: "Server error", error: err },
            { status: 500 }
        );
    }
}