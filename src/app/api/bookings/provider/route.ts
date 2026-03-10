import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

interface ProviderBooking {
    id: number;
    user_id: number;
    service_id: number;
    booking_date: string;
    status: string;
    created_at: string;
    service_name: string;
    price: number;
    customer_name: string;
    customer_email: string;
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

        if (user.role !== 'provider') {
            return NextResponse.json(
                { error: 'Only providers can view their received bookings' },
                { status: 403 }
            );
        }


        const bookings = await query<ProviderBooking[]>(
            `SELECT 
        b.id,
        b.user_id,
        b.service_id,
        b.booking_date,
        b.status,
        b.created_at,
        s.service_name,
        s.price,
        u.name AS customer_name,
        u.email AS customer_email
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN users u ON b.user_id = u.id
      WHERE s.provider_id = ?
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
