'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

interface ServiceDetail {
    id: number;
    provider_id: number;
    service_name: string;
    price: number;
    category: string;
    provider_name: string;
    provider_email: string;
    provider_location: string;
    provider_category: string;
}

interface User {
    id: number;
    role: 'user' | 'provider';
}

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [service, setService] = useState<ServiceDetail | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [bookingDate, setBookingDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const router = useRouter();

    useEffect(() => {
        fetchService();
        checkAuth();
    }, [id]);

    const checkAuth = async () => {
        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            }
        } catch (error) {

        }
    };

    const fetchService = async () => {
        try {
            const res = await fetch(`/api/services/${id}`);
            if (res.ok) {
                const data = await res.json();
                setService(data.service);
            }
        } catch (error) {

        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            router.push('/login');
            return;
        }

        setBooking(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ service_id: parseInt(id), booking_date: bookingDate }),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage({ type: 'error', text: data.error });
                return;
            }

            setMessage({ type: 'success', text: 'Booking created successfully!' });
            setBookingDate('');
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred' });

        } finally {
            setBooking(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!service) {
        return (
            <div className="text-center py-16 card max-w-md mx-auto">
                <span className="text-6xl mb-4 block">❌</span>
                <p className="text-xl text-gray-600">Service not found</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-8">
            <div className="card p-8 mb-6">
                <div className="flex justify-between items-start mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">{service.service_name}</h1>
                    <span className="badge badge-category text-sm">
                        {service.category}
                    </span>
                </div>

                <div className="price-tag text-4xl mb-8">
                    ₹{Number(service.price).toFixed(2)}
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                    <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                        <span>🏢</span> Provider Information
                    </h2>
                    <div className="grid grid-cols-2 gap-4 text-gray-600">
                        <div>
                            <span className="text-sm text-gray-500">Business Name</span>
                            <p className="font-semibold">{service.provider_name}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500">Specialty</span>
                            <p className="font-semibold">{service.provider_category}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500">Location</span>
                            <p className="font-semibold">{service.provider_location}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500">Contact</span>
                            <p className="font-semibold">{service.provider_email}</p>
                        </div>
                    </div>
                </div>
            </div>

            {user?.role === 'user' && (
                <div className="card p-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <span>📅</span> Book This Service
                    </h2>

                    {message.text && (
                        <div className={`p-4 rounded-xl mb-6 animate-fade-in ${message.type === 'error'
                            ? 'bg-red-50 border border-red-200 text-red-700'
                            : 'bg-green-50 border border-green-200 text-green-700'
                            }`}>
                            {message.type === 'error' ? '⚠️' : '✓'} {message.text}
                        </div>
                    )}

                    <form onSubmit={handleBooking}>
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Select Date
                            </label>
                            <input
                                type="date"
                                value={bookingDate}
                                onChange={(e) => setBookingDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                required
                                className="input-modern"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={booking}
                            className="btn-primary w-full py-4 text-lg disabled:opacity-50"
                        >
                            {booking ? '⏳ Booking...' : '🎯 Confirm Booking'}
                        </button>
                    </form>
                </div>
            )}

            {!user && (
                <div className="card p-8 text-center bg-gradient-to-r from-purple-50 to-indigo-50">
                    <span className="text-4xl mb-4 block">🔐</span>
                    <p className="text-gray-700 mb-4">Please login to book this service.</p>
                    <a href="/login" className="btn-primary inline-block px-8">
                        Sign In
                    </a>
                </div>
            )}
        </div>
    );
}
