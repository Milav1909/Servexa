'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'user' | 'provider';
}

export default function Navbar() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            }
        } catch (error) {

        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            setUser(null);
            window.location.href = '/';
        } catch (error) {

        }
    };

    return (
        <nav className="bg-white/95 backdrop-blur-md text-gray-800 shadow-lg sticky top-0 z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-center h-16">

                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-300 transition-all duration-300 group-hover:scale-105">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            LocalServe
                        </span>
                    </Link>


                    <div className="flex items-center gap-1">
                        {loading ? (
                            <div className="px-4 py-2">
                                <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : user ? (
                            <>
                                {user.role === 'user' ? (
                                    <>
                                        <Link
                                            href="/services"
                                            className="px-4 py-2 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200 font-medium"
                                        >
                                            Services
                                        </Link>
                                        <Link
                                            href="/bookings/user"
                                            className="px-4 py-2 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200 font-medium"
                                        >
                                            My Bookings
                                        </Link>
                                        <Link
                                            href="/profile"
                                            className="px-4 py-2 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200 font-medium"
                                        >
                                            Profile
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/provider/dashboard"
                                            className="px-4 py-2 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200 font-medium"
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            href="/bookings/provider"
                                            className="px-4 py-2 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200 font-medium"
                                        >
                                            Bookings
                                        </Link>
                                        <Link
                                            href="/provider/reviews"
                                            className="px-4 py-2 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200 font-medium"
                                        >
                                            Reviews
                                        </Link>
                                    </>
                                )}

                                <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                                    <div className="flex items-center gap-2">
                                        <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="hidden sm:block">
                                            <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                                            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : null}
                    </div>
                </div>
            </div>
        </nav>
    );
}
