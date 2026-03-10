/**
 * Get Categories API
 * GET /api/services/categories - Get all unique categories
 * 
 * DBMS Concepts:
 * - SELECT DISTINCT to get unique values
 */

import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        const categories = await query<{ category: string }[]>(
            'SELECT DISTINCT category FROM services ORDER BY category'
        );

        return NextResponse.json({
            categories: categories.map(c => c.category)
        });
    } catch (error) {
        console.error('Get categories error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
