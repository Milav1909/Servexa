import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth';
import { ResultSetHeader } from 'mysql2';

export async function POST(request: NextRequest) {
    try {
        const { name, email, password, category, location, pincode } = await request.json();


        if (!name || !email || !password || !category || !location) {
            return NextResponse.json(
                { error: 'All fields are required (name, email, password, category, location)' },
                { status: 400 }
            );
        }


        const existingProviders = await query<{ id: number }[]>(
            'SELECT id FROM service_providers WHERE email = ?',
            [email]
        );

        if (existingProviders.length > 0) {
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 409 }
            );
        }

        const hashedPassword = await hashPassword(password);

        const result = await query<ResultSetHeader>(
            'INSERT INTO service_providers (name, email, password, category, location, pincode) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, hashedPassword, category, location, pincode || null]
        );


        const token = generateToken({
            id: result.insertId,
            email,
            role: 'provider',
            name
        });


        await setAuthCookie(token);

        return NextResponse.json({
            message: 'Registration successful',
            provider: { id: result.insertId, name, email, category, location, pincode, role: 'provider' }
        }, { status: 201 });

    } catch (error) {

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
