'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BookingCard from '@/components/BookingCard';

interface Booking {
    id: number;
    service_name: string;
    price: number;
    booking_date: string;
    status: 'Pending' | 'Accepted' | 'Completed';
    customer_name: string;
    customer_email: string;
}

export default function ProviderBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const authRes = await fetch('/api/auth/me');
            if (!authRes.ok) {
                router.push('/provider/login');
                return;
            }

            const authData = await authRes.json();
            if (authData.user.role !== 'provider') {
                router.push('/provider/login');
                return;
            }

            const res = await fetch('/api/bookings/provider');
            if (res.ok) {
                const data = await res.json();
                setBookings(data.bookings);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (bookingId: number, newStatus: string) => {
        try {
            const res = await fetch(`/api/bookings/${bookingId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                setBookings(bookings.map(b =>
                    b.id === bookingId ? { ...b, status: newStatus as Booking['status'] } : b
                ));
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const pendingBookings = bookings.filter(b => b.status === 'Pending');
    const acceptedBookings = bookings.filter(b => b.status === 'Accepted');
    const completedBookings = bookings.filter(b => b.status === 'Completed');

    return (
        <div className="max-w-6xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Manage Bookings</h1>
                <p className="text-gray-500 mt-2">Accept, track, and complete customer bookings</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="card p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-l-4 border-yellow-400">
                    <p className="text-3xl font-bold text-yellow-600">{pendingBookings.length}</p>
                    <p className="text-gray-600 font-medium">Pending</p>
                </div>
                <div className="card p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-blue-400">
                    <p className="text-3xl font-bold text-blue-600">{acceptedBookings.length}</p>
                    <p className="text-gray-600 font-medium">In Progress</p>
                </div>
                <div className="card p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-green-400">
                    <p className="text-3xl font-bold text-green-600">{completedBookings.length}</p>
                    <p className="text-gray-600 font-medium">Completed</p>
                </div>
            </div>

            {bookings.length === 0 ? (
                <div className="card p-12 text-center">
                    <span className="text-6xl mb-4 block">📋</span>
                    <p className="text-xl text-gray-600">No bookings yet. Add services to start receiving bookings!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {bookings.map((booking) => (
                        <BookingCard
                            key={booking.id}
                            {...booking}
                            isProvider={true}
                            onStatusUpdate={updateStatus}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
