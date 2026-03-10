/**
 * User Registration API
 * POST /api/auth/user/register
 * 
 * DBMS Concepts:
 * - INSERT query with prepared statements
 * - UNIQUE constraint handling (duplicate email)
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth';
import { ResultSetHeader } from 'mysql2';

export async function POST(request: NextRequest) {
    try {
        const { name, email, password, phone } = await request.json();

        // Validate required fields (address is now optional)
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Name, email, and password are required' },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existingUsers = await query<{ id: number }[]>(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 409 }
            );
        }

        // Hash password using bcrypt
        const hashedPassword = await hashPassword(password);

        // INSERT new user into database (address will be added later in profile)
        const result = await query<ResultSetHeader>(
            'INSERT INTO users (name, email, password, address, phone) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, null, phone || null]
        );

        // Generate JWT token
        const token = generateToken({
            id: result.insertId,
            email,
            role: 'user',
            name
        });

        // Set HTTP-only cookie
        await setAuthCookie(token);

        return NextResponse.json({
            message: 'Registration successful',
            user: { id: result.insertId, name, email, role: 'user' }
        }, { status: 201 });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
