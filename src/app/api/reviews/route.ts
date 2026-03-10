/**
 * Create Review API
 * POST /api/reviews - Create a review for a service provider
 * 
 * DBMS Concepts:
 * - INSERT with CHECK constraint (rating 1-5)
 * - Foreign keys (user_id, provider_id)
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { ResultSetHeader } from 'mysql2';

export async function POST(request: NextRequest) {
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
                { error: 'Only customers can write reviews' },
                { status: 403 }
            );
        }

        const { provider_id, rating, comment } = await request.json();

        // Validate required fields
        if (!provider_id || !rating) {
            return NextResponse.json(
                { error: 'Provider ID and rating are required' },
                { status: 400 }
            );
        }

        // Validate rating range (1-5)
        if (rating < 1 || rating > 5) {
            return NextResponse.json(
                { error: 'Rating must be between 1 and 5' },
                { status: 400 }
            );
        }

        // Verify provider exists
        const providers = await query<{ id: number }[]>(
            'SELECT id FROM service_providers WHERE id = ?',
            [provider_id]
        );

        if (providers.length === 0) {
            return NextResponse.json(
                { error: 'Provider not found' },
                { status: 404 }
            );
        }

        // Check if user has a completed booking with this provider
        const completedBookings = await query<{ id: number }[]>(
            `SELECT b.id FROM bookings b
       JOIN services s ON b.service_id = s.id
       WHERE b.user_id = ? AND s.provider_id = ? AND b.status = 'Completed'`,
            [user.id, provider_id]
        );

        if (completedBookings.length === 0) {
            return NextResponse.json(
                { error: 'You can only review providers after completing a booking' },
                { status: 403 }
            );
        }

        // INSERT new review
        const result = await query<ResultSetHeader>(
            'INSERT INTO reviews (user_id, provider_id, rating, comment) VALUES (?, ?, ?, ?)',
            [user.id, provider_id, rating, comment || null]
        );

        return NextResponse.json({
            message: 'Review submitted successfully',
            review: {
                id: result.insertId,
                user_id: user.id,
                provider_id,
                rating,
                comment
            }
        }, { status: 201 });

    } catch (error) {
        console.error('Create review error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
