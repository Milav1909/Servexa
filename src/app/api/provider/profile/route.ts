/**
 * Provider Profile API
 * GET /api/provider/profile - Get provider profile
 * PUT /api/provider/profile - Update provider profile
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { ResultSetHeader } from 'mysql2';

interface ProviderProfile {
    id: number;
    name: string;
    email: string;
    location: string | null;
    pincode: string | null;
    phone: string | null;
    created_at: string;
}

// GET - Fetch provider profile
export async function GET() {
    try {
        const user = await getCurrentUser();

        if (!user || user.role !== 'provider') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let providers: ProviderProfile[];

        try {
            providers = await query<ProviderProfile[]>(
                'SELECT id, name, email, location, pincode, phone, created_at FROM service_providers WHERE id = ?',
                [user.id]
            );
        } catch {
            // Fallback: phone column may not exist yet
            providers = await query<ProviderProfile[]>(
                'SELECT id, name, email, location, pincode, NULL as phone, created_at FROM service_providers WHERE id = ?',
                [user.id]
            );
        }

        if (providers.length === 0) {
            return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
        }

        return NextResponse.json({ profile: providers[0] });
    } catch (error) {
        console.error('Provider profile fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT - Update provider profile
export async function PUT(request: NextRequest) {
    try {
        const user = await getCurrentUser();

        if (!user || user.role !== 'provider') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { name, location, pincode, phone } = await request.json();

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        try {
            await query<ResultSetHeader>(
                'UPDATE service_providers SET name = ?, location = ?, pincode = ?, phone = ? WHERE id = ?',
                [name, location || null, pincode || null, phone || null, user.id]
            );
        } catch (error) {
            // If phone column is missing, update without it
            await query<ResultSetHeader>(
                'UPDATE service_providers SET name = ?, location = ?, pincode = ? WHERE id = ?',
                [name, location || null, pincode || null, user.id]
            );
        }

        return NextResponse.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Provider profile update error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
// DELETE - Remove provider account
export async function DELETE() {
    try {
        const user = await getCurrentUser();

        if (!user || user.role !== 'provider') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // DELETE provider from database
        // Foreign keys with ON DELETE CASCADE will handle services, bookings, and reviews
        await query<ResultSetHeader>(
            'DELETE FROM service_providers WHERE id = ?',
            [user.id]
        );

        return NextResponse.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Provider profile delete error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
