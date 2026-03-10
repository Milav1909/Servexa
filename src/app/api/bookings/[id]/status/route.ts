import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { ResultSetHeader } from 'mysql2';

interface BookingCheck {
    id: number;
    provider_id: number;
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();
        const { id } = await params;

        if (!user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        if (user.role !== 'provider') {
            return NextResponse.json(
                { error: 'Only providers can update booking status' },
                { status: 403 }
            );
        }

        const { status } = await request.json();


        const validStatuses = ['Pending', 'Accepted', 'Completed'];
        if (!status || !validStatuses.includes(status)) {
            return NextResponse.json(
                { error: 'Invalid status. Must be: Pending, Accepted, or Completed' },
                { status: 400 }
            );
        }


        const bookings = await query<BookingCheck[]>(
            `SELECT b.id, s.provider_id
       FROM bookings b
       JOIN services s ON b.service_id = s.id
       WHERE b.id = ?`,
            [id]
        );

        if (bookings.length === 0) {
            return NextResponse.json(
                { error: 'Booking not found' },
                { status: 404 }
            );
        }


        if (bookings[0].provider_id !== user.id) {
            return NextResponse.json(
                { error: 'Not authorized to update this booking' },
                { status: 403 }
            );
        }


        await query<ResultSetHeader>(
            'UPDATE bookings SET status = ? WHERE id = ?',
            [status, id]
        );

        return NextResponse.json({
            message: 'Booking status updated successfully',
            booking: { id: parseInt(id), status }
        });

    } catch (error) {

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
