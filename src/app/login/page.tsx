'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Login failed');
                return;
            }

            window.location.href = '/';
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">🔐</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
                    <p className="text-gray-500 mt-2">Sign in to your customer account</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 animate-fade-in">
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="card p-8">
                    <div className="mb-5">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="input-modern"
                            placeholder="john@example.com"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="input-modern"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-4 text-lg disabled:opacity-50"
                    >
                        {loading ? '⏳ Signing in...' : '🔓 Sign In'}
                    </button>
                </form>

                <p className="text-center mt-6 text-gray-600">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="text-purple-600 font-semibold hover:underline">
                        Create one
                    </Link>
                </p>

                <p className="text-center mt-3 text-gray-500">
                    Are you a service provider?{' '}
                    <Link href="/provider/login" className="text-green-600 font-semibold hover:underline">
                        Provider Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
