import { NextResponse } from 'next/server';
import { supabaseClient } from '@/libs/supabaseClient';

export async function GET() {
    try {
        console.log('🔍 Fetching data from Temp_Humidity table...');
        
        const { data: Temp_Humidity, error } = await supabaseClient
            .from('Temp_Humidity')
            .select('*');

        if (error) {
            console.error('❌ Supabase error:', error);
            return NextResponse.json(
                { message: "Error fetching temperature humidity data", error: error.message },
                { status: 500 }
            );
        }

        console.log('✅ Data fetched successfully. Records found:', Temp_Humidity?.length || 0);
        console.log('📊 Sample data:', Temp_Humidity?.slice(0, 2)); // แสดง 2 record แรก

        return NextResponse.json(
            { 
                message: "Success", 
                data: Temp_Humidity,
                count: Temp_Humidity?.length || 0
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