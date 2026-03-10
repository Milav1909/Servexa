/**
 * User Profile API
 * GET /api/profile - Get user profile
 * PUT /api/profile - Update user profile
 * DELETE /api/profile - Delete user account
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { ResultSetHeader } from 'mysql2';

interface UserProfile {
    id: number;
    name: string;
    email: string;
    address: string | null;
    phone: string | null;
    created_at: string;
}

// GET - Fetch user profile
export async function GET() {
    try {
        const user = await getCurrentUser();

        if (!user || user.role !== 'user') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const users = await query<UserProfile[]>(
            'SELECT id, name, email, address, phone, created_at FROM users WHERE id = ?',
            [user.id]
        );

        if (users.length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ profile: users[0] });
    } catch (error) {
        console.error('Profile fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
    try {
        const user = await getCurrentUser();

        if (!user || user.role !== 'user') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { name, address, phone } = await request.json();

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        await query<ResultSetHeader>(
            'UPDATE users SET name = ?, address = ?, phone = ? WHERE id = ?',
            [name, address || null, phone || null, user.id]
        );

        return NextResponse.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Profile update error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE - Delete user account
export async function DELETE() {
    try {
        const user = await getCurrentUser();

        if (!user || user.role !== 'user') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Delete user (CASCADE will delete related bookings and reviews)
        await query<ResultSetHeader>('DELETE FROM users WHERE id = ?', [user.id]);

        return NextResponse.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Account delete error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
