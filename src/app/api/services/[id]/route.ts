/**
 * Single Service API
 * GET /api/services/[id] - Get service details by ID
 * 
 * DBMS Concepts:
 * - SELECT with JOIN to get related data
 * - WHERE clause with primary key
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface ServiceDetail {
    id: number;
    provider_id: number;
    service_name: string;
    price: number;
    category: string;
    provider_name: string;
    provider_email: string;
    provider_location: string;
    provider_category: string;
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // JOIN query to get service with provider details
        const services = await query<ServiceDetail[]>(
            `SELECT 
        s.id,
        s.provider_id,
        s.service_name,
        s.price,
        s.category,
        sp.name AS provider_name,
        sp.email AS provider_email,
        sp.location AS provider_location,
        sp.category AS provider_category
      FROM services s
      JOIN service_providers sp ON s.provider_id = sp.id
      WHERE s.id = ?`,
            [id]
        );

        if (services.length === 0) {
            return NextResponse.json(
                { error: 'Service not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ service: services[0] });
    } catch (error) {
        console.error('Get service error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
