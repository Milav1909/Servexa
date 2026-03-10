/**
 * Provider Login API
 * POST /api/auth/provider/login
 * 
 * DBMS Concepts:
 * - SELECT query from service_providers table
 * - Password verification with bcrypt
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { comparePassword, generateToken, setAuthCookie } from '@/lib/auth';

interface Provider {
    id: number;
    name: string;
    email: string;
    password: string;
    category: string;
    location: string;
}

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        // Validate required fields
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // SELECT provider from database
        const providers = await query<Provider[]>(
            'SELECT id, name, email, password, category, location FROM service_providers WHERE email = ?',
            [email]
        );

        if (providers.length === 0) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        const provider = providers[0];

        // Compare password with bcrypt
        const isValidPassword = await comparePassword(password, provider.password);

        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = generateToken({
            id: provider.id,
            email: provider.email,
            role: 'provider',
            name: provider.name
        });

        // Set HTTP-only cookie
        await setAuthCookie(token);

        return NextResponse.json({
            message: 'Login successful',
            provider: {
                id: provider.id,
                name: provider.name,
                email: provider.email,
                category: provider.category,
                location: provider.location,
                role: 'provider'
            }
        });

    } catch (error) {
        console.error('Provider login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
