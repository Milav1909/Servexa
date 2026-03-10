import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

interface BookingWithDetails {
    id: number;
    user_id: number;
    service_id: number;
    booking_date: string;
    status: string;
    created_at: string;
    service_name: string;
    price: number;
    provider_id: number;
    provider_name: string;
    provider_location: string;
}

export async function GET() {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        if (user.role !== 'user') {
            return NextResponse.json(
                { error: 'Only customers can view their bookings here' },
                { status: 403 }
            );
        }


        const bookings = await query<BookingWithDetails[]>(
            `SELECT 
        b.id,
        b.user_id,
        b.service_id,
        b.booking_date,
        b.status,
        b.created_at,
        s.service_name,
        s.price,
        sp.id AS provider_id,
        sp.name AS provider_name,
        sp.location AS provider_location
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN service_providers sp ON s.provider_id = sp.id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC`,
            [user.id]
        );

        return NextResponse.json({ bookings });
    } catch (error) {

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
