/**
 * Services API
 * GET /api/services - List all services (with optional category filter)
 * POST /api/services - Create a new service (provider only)
 * 
 * DBMS Concepts:
 * - JOIN query to combine services with provider info
 * - WHERE clause with dynamic filtering
 * - INSERT with foreign key
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { ResultSetHeader } from 'mysql2';

interface Service {
    id: number;
    provider_id: number;
    service_name: string;
    price: number;
    category: string;
    provider_name: string;
    provider_location: string;
    provider_pincode: string | null;
}

/**
 * GET - List all services
 * Supports filtering by category and pincode via query parameters
 * Uses JOIN to get provider information
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const pincode = searchParams.get('pincode');

        let sql = `
      SELECT 
        s.id,
        s.provider_id,
        s.service_name,
        s.price,
        s.category,
        sp.name AS provider_name,
        sp.location AS provider_location,
        sp.pincode AS provider_pincode
      FROM services s
      JOIN service_providers sp ON s.provider_id = sp.id
    `;

        const params: string[] = [];
        const conditions: string[] = [];

        // Add category filter if provided
        if (category) {
            conditions.push('s.category = ?');
            params.push(category);
        }

        // Add pincode filter if provided - match provider's service area
        if (pincode) {
            // Match exact pincode OR first 3 digits (nearby areas)
            conditions.push('(sp.pincode = ? OR LEFT(sp.pincode, 3) = LEFT(?, 3))');
            params.push(pincode, pincode);
        }

        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ');
        }

        sql += ' ORDER BY s.id DESC';

        const services = await query<Service[]>(sql, params);

        return NextResponse.json({ services });
    } catch (error) {
        console.error('Get services error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * POST - Create a new service
 * Requires authentication as a provider
 */
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

        // Check if user is a provider
        if (user.role !== 'provider') {
            return NextResponse.json(
                { error: 'Only service providers can create services' },
                { status: 403 }
            );
        }

        const { service_name, price, category } = await request.json();

        // Validate required fields
        if (!service_name || !price || !category) {
            return NextResponse.json(
                { error: 'Service name, price, and category are required' },
                { status: 400 }
            );
        }

        // INSERT new service with provider_id foreign key
        const result = await query<ResultSetHeader>(
            'INSERT INTO services (provider_id, service_name, price, category) VALUES (?, ?, ?, ?)',
            [user.id, service_name, price, category]
        );

        return NextResponse.json({
            message: 'Service created successfully',
            service: {
                id: result.insertId,
                provider_id: user.id,
                service_name,
                price,
                category
            }
        }, { status: 201 });

    } catch (error) {
        console.error('Create service error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * PUT - Update a service
 * Requires authentication as the service owner
 */
export async function PUT(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'provider') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id, service_name, price, category } = await request.json();

        if (!id || !service_name || !price || !category) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const result = await query<ResultSetHeader>(
            'UPDATE services SET service_name = ?, price = ?, category = ? WHERE id = ? AND provider_id = ?',
            [service_name, price, category, id, user.id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: 'Service not found or unauthorized' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Service updated successfully' });
    } catch (error) {
        console.error('Update service error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

/**
 * DELETE - Remove a service
 * Requires authentication as the service owner
 */
export async function DELETE(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'provider') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Service ID required' }, { status: 400 });
        }

        const result = await query<ResultSetHeader>(
            'DELETE FROM services WHERE id = ? AND provider_id = ?',
            [parseInt(id), user.id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: 'Service not found or unauthorized' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Service deleted successfully' });
    } catch (error) {
        console.error('Delete service error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
