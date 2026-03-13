'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BookingCard from '@/components/BookingCard';
import { ClipboardList, Loader2, Clock, CheckCircle2, PlayCircle } from 'lucide-react';

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
            const res = await fetch('/api/bookings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: bookingId, status: newStatus }),
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
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="flex flex-col items-center">
                    <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
                    <p className="text-slate-500 font-medium">Loading bookings...</p>
                </div>
            </div>
        );
    }

    const pendingBookings = bookings.filter(b => b.status === 'Pending');
    const acceptedBookings = bookings.filter(b => b.status === 'Accepted');
    const completedBookings = bookings.filter(b => b.status === 'Completed');

    return (
        <div className="max-w-6xl mx-auto py-12 px-6">
            <div className="mb-10 text-center sm:text-left">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Manage Bookings</h1>
                <p className="text-slate-500 mt-2 font-medium">Accept, track, and complete customer bookings</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex items-center gap-5 relative overflow-hidden group hover:border-amber-300 transition-colors">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -z-10 opacity-50 transition-transform group-hover:scale-110"></div>
                    <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0 border border-amber-200">
                        <Clock className="w-7 h-7 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-1">{pendingBookings.length}</p>
                        <p className="text-slate-500 font-semibold text-sm">Pending</p>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex items-center gap-5 relative overflow-hidden group hover:border-indigo-300 transition-colors">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-10 opacity-50 transition-transform group-hover:scale-110"></div>
                    <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center shrink-0 border border-indigo-200">
                        <PlayCircle className="w-7 h-7 text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-1">{acceptedBookings.length}</p>
                        <p className="text-slate-500 font-semibold text-sm">In Progress</p>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex items-center gap-5 relative overflow-hidden group hover:border-emerald-300 transition-colors">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-10 opacity-50 transition-transform group-hover:scale-110"></div>
                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0 border border-emerald-200">
                        <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-1">{completedBookings.length}</p>
                        <p className="text-slate-500 font-semibold text-sm">Completed</p>
                    </div>
                </div>
            </div>

            {bookings.length === 0 ? (
                <div className="card py-16 px-6 text-center border-dashed border-2 border-slate-200 bg-slate-50/50">
                     <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm border border-slate-100">
                         <ClipboardList className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 mb-2">No bookings yet.</h3>
                    <p className="text-slate-500 font-medium">Add services to start receiving bookings!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
