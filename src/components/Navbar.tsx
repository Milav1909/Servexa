'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, LogOut, User as UserIcon } from 'lucide-react';

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
            console.error('Auth verification failed', error);
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
            console.error('Logout failed', error);
        }
    };

    return (
        <nav className="bg-white/80 backdrop-blur-xl text-slate-800 shadow-sm sticky top-0 z-50 border-b border-slate-200/60">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-center h-16">

                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-[0_2px_8px_rgba(79,70,229,0.3)] group-hover:scale-105 transition-all duration-300">
                            <MapPin className="w-5 h-5 text-white" strokeWidth={2.5} />
                        </div>
                        <span className="text-xl font-bold text-slate-900 tracking-tight">
                            Servexa
                        </span>
                    </Link>

                    <div className="flex items-center gap-1">
                        {loading ? (
                            <div className="px-4 py-2 flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : user ? (
                            <>
                                {user.role === 'user' ? (
                                    <>
                                        <Link
                                            href="/services"
                                            className="px-4 py-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-all duration-200 font-medium text-sm"
                                        >
                                            Services
                                        </Link>
                                        <Link
                                            href="/bookings/user"
                                            className="px-4 py-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-all duration-200 font-medium text-sm"
                                        >
                                            My Bookings
                                        </Link>
                                        <Link
                                            href="/profile"
                                            className="px-4 py-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-all duration-200 font-medium text-sm"
                                        >
                                            Profile
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/provider/dashboard"
                                            className="px-4 py-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-all duration-200 font-medium text-sm"
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            href="/bookings/provider"
                                            className="px-4 py-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-all duration-200 font-medium text-sm"
                                        >
                                            Bookings
                                        </Link>
                                        <Link
                                            href="/provider/reviews"
                                            className="px-4 py-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-all duration-200 font-medium text-sm"
                                        >
                                            Reviews
                                        </Link>
                                        <Link
                                            href="/provider/profile"
                                            className="px-4 py-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-all duration-200 font-medium text-sm"
                                        >
                                            Profile
                                        </Link>
                                    </>
                                )}

                                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-slate-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                                            <UserIcon className="w-4 h-4" />
                                        </div>
                                        <div className="hidden sm:block">
                                            <p className="text-sm font-semibold text-slate-800 leading-none mb-1">{user.name}</p>
                                            <p className="text-xs text-slate-500 capitalize leading-none">{user.role}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all duration-200"
                                        title="Logout"
                                    >
                                        <LogOut className="w-5 h-5" />
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

