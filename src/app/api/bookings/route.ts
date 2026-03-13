/**
 * Create Booking API
 * POST /api/bookings - Create a new booking
 * 
 * DBMS Concepts:
 * - INSERT with multiple foreign keys (user_id, service_id)
 * - Default value for status ('Pending')
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { ResultSetHeader } from 'mysql2';

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();

        // Check authentication
        if (!user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        // Check if user is a customer (not provider)
        if (user.role !== 'user') {
            return NextResponse.json(
                { error: 'Only customers can create bookings' },
                { status: 403 }
            );
        }

        const { service_id, booking_date, time_slot } = await request.json();

        // Validate required fields
        if (!service_id || !booking_date) {
            return NextResponse.json(
                { error: 'Service ID and booking date are required' },
                { status: 400 }
            );
        }

        // Verify service exists
        const services = await query<{ id: number }[]>(
            'SELECT id FROM services WHERE id = ?',
            [service_id]
        );

        if (services.length === 0) {
            return NextResponse.json(
                { error: 'Service not found' },
                { status: 404 }
            );
        }

        // INSERT new booking with foreign keys
        // Status defaults to 'Pending' as defined in schema
        const result = await query<ResultSetHeader>(
            'INSERT INTO bookings (user_id, service_id, booking_date, time_slot) VALUES (?, ?, ?, ?)',
            [user.id, service_id, booking_date, time_slot || null]
        );

        return NextResponse.json({
            message: 'Booking created successfully',
            booking: {
                id: result.insertId,
                user_id: user.id,
                service_id,
                booking_date,
                time_slot: time_slot || null,
                status: 'Pending'
            }
        }, { status: 201 });

    } catch (error) {
        console.error('Create booking error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * PATCH - Update booking status
 * Providers can accept or complete bookings
 */
export async function PATCH(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'provider') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id, status } = await request.json();

        if (!['Accepted', 'Completed'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        // Update status only if the service belongs to this provider
        const result = await query<ResultSetHeader>(
            `UPDATE bookings b
             JOIN services s ON b.service_id = s.id
             SET b.status = ?
             WHERE b.id = ? AND s.provider_id = ?`,
            [status, id, user.id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: 'Booking not found or unauthorized' }, { status: 404 });
        }

        return NextResponse.json({ message: `Booking ${status.toLowerCase()} successfully` });
    } catch (error) {
        console.error('Update booking error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

/**
 * DELETE - Cancel booking
 * Only customers can cancel their own 'Pending' bookings
 */
export async function DELETE(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'user') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Booking ID required' }, { status: 400 });
        }

        // Delete only if it belongs to the user and is still 'Pending'
        const result = await query<ResultSetHeader>(
            'DELETE FROM bookings WHERE id = ? AND user_id = ? AND status = "Pending"',
            [parseInt(id), user.id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ 
                error: 'Booking not found, not pending, or unauthorized' 
            }, { status: 404 });
        }

        return NextResponse.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        console.error('Cancel booking error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
