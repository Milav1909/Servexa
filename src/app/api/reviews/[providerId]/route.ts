/**
 * Provider Reviews API
 * GET /api/reviews/[providerId] - Get all reviews for a specific provider
 * 
 * DBMS Concepts:
 * - SELECT with JOIN to get reviewer names
 * - WHERE clause with foreign key
 * - ORDER BY for sorting
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface Review {
    id: number;
    rating: number;
    comment: string | null;
    created_at: string;
    reviewer_name: string;
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ providerId: string }> }
) {
    try {
        const { providerId } = await params;

        // JOIN query to get reviews with reviewer names
        const reviews = await query<Review[]>(
            `SELECT 
                r.id,
                r.rating,
                r.comment,
                r.created_at,
                u.name AS reviewer_name
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.provider_id = ?
            ORDER BY r.created_at DESC`,
            [providerId]
        );

        // Calculate average rating
        const avgRating = reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

        return NextResponse.json({
            reviews,
            averageRating: Math.round(avgRating * 10) / 10,
            totalReviews: reviews.length
        });
    } catch (error) {
        console.error('Get provider reviews error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
