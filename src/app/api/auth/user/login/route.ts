/**
 * User Login API
 * POST /api/auth/user/login
 * 
 * DBMS Concepts:
 * - SELECT query with WHERE clause
 * - Prepared statements for SQL injection prevention
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { comparePassword, generateToken, setAuthCookie } from '@/lib/auth';

interface User {
    id: number;
    name: string;
    email: string;
    password: string;
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

        // SELECT user from database
        const users = await query<User[]>(
            'SELECT id, name, email, password FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        const user = users[0];

        // Compare password with bcrypt
        const isValidPassword = await comparePassword(password, user.password);

        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = generateToken({
            id: user.id,
            email: user.email,
            role: 'user',
            name: user.name
        });

        // Set HTTP-only cookie
        await setAuthCookie(token);

        return NextResponse.json({
            message: 'Login successful',
            user: { id: user.id, name: user.name, email: user.email, role: 'user' }
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
