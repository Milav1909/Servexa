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

        const { service_id, booking_date } = await request.json();

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
            'INSERT INTO bookings (user_id, service_id, booking_date) VALUES (?, ?, ?)',
            [user.id, service_id, booking_date]
        );

        return NextResponse.json({
            message: 'Booking created successfully',
            booking: {
                id: result.insertId,
                user_id: user.id,
                service_id,
                booking_date,
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
