/**
 * Provider Reviews API
 * GET /api/reviews/provider/[id] - Get all reviews for a provider
 * 
 * DBMS Concepts:
 * - JOIN query to get reviewer names
 * - Aggregate function (AVG) for average rating
 * - GROUP BY for aggregation
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface Review {
    id: number;
    user_id: number;
    rating: number;
    comment: string | null;
    created_at: string;
    reviewer_name: string;
}

interface AverageRating {
    avg_rating: number | null;
    total_reviews: number;
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Verify provider exists
        const providers = await query<{ id: number; name: string }[]>(
            'SELECT id, name FROM service_providers WHERE id = ?',
            [id]
        );

        if (providers.length === 0) {
            return NextResponse.json(
                { error: 'Provider not found' },
                { status: 404 }
            );
        }

        // Get all reviews with reviewer names using JOIN
        const reviews = await query<Review[]>(
            `SELECT 
        r.id,
        r.user_id,
        r.rating,
        r.comment,
        r.created_at,
        u.name AS reviewer_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.provider_id = ?
      ORDER BY r.created_at DESC`,
            [id]
        );

        // Calculate average rating using AVG() aggregate function
        const avgResult = await query<AverageRating[]>(
            `SELECT 
        AVG(rating) AS avg_rating,
        COUNT(*) AS total_reviews
      FROM reviews
      WHERE provider_id = ?`,
            [id]
        );

        const stats = avgResult[0] || { avg_rating: null, total_reviews: 0 };

        return NextResponse.json({
            provider: providers[0],
            reviews,
            stats: {
                average_rating: stats.avg_rating ? parseFloat(stats.avg_rating.toFixed(1)) : null,
                total_reviews: stats.total_reviews
            }
        });

    } catch (error) {
        console.error('Get provider reviews error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
