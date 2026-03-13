'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BookingCard from '@/components/BookingCard';
import { Loader2, Mailbox, Star, Check } from 'lucide-react';

interface Booking {
    id: number;
    service_name: string;
    price: number;
    booking_date: string;
    status: 'Pending' | 'Accepted' | 'Completed';
    provider_name: string;
    provider_location: string;
    provider_id: number;
}

export default function UserBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const authRes = await fetch('/api/auth/me');
            if (!authRes.ok) {
                router.push('/login');
                return;
            }

            const res = await fetch('/api/bookings/user');
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

    const openReviewModal = (booking: Booking) => {
        setSelectedBooking(booking);
        setShowReviewModal(true);
        setRating(5);
        setComment('');
    };

    const submitReview = async () => {
        if (!selectedBooking) return;
        setSubmitting(true);

        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    provider_id: selectedBooking.provider_id,
                    rating,
                    comment: comment || null
                }),
            });

            if (res.ok) {
                setShowReviewModal(false);
                alert('Review submitted successfully!');
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to submit review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = async (id: number) => {
        if (!confirm('Are you sure you want to cancel this booking?')) return;

        try {
            const res = await fetch(`/api/bookings?id=${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setBookings(bookings.filter(b => b.id !== id));
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to cancel booking');
            }
        } catch (error) {
            console.error('Error cancelling booking:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="flex flex-col items-center">
                    <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
                    <p className="text-slate-500 font-medium">Loading your bookings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-12 px-6">
            <div className="mb-10 text-center sm:text-left">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Bookings</h1>
                <p className="text-slate-500 mt-2 font-medium">View and manage your service bookings</p>
            </div>

            {bookings.length === 0 ? (
                <div className="card py-16 px-6 text-center border-dashed border-2 border-slate-200 bg-slate-50/50">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm border border-slate-100">
                         <Mailbox className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 mb-2">You haven&apos;t made any bookings yet.</h3>
                    <p className="text-slate-500 mb-6 font-medium">Find the perfect service provider today.</p>
                    <a href="/services" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-sm inline-block">
                        Browse Services
                    </a>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="relative group">
                            <BookingCard {...booking} onCancel={handleCancel} />
                            {booking.status === 'Completed' && (
                                <button
                                    onClick={() => openReviewModal(booking)}
                                    className="mt-4 w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 shadow-md transition-all flex items-center justify-center gap-2"
                                >
                                    <Star className="w-5 h-5 text-amber-400 fill-amber-400/20" /> Leave a Review
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Review Modal */}
            {showReviewModal && selectedBooking && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full animate-fade-in shadow-2xl border border-slate-100">
                        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Leave a Review</h2>
                        <p className="text-slate-500 font-medium mb-8">Rate your experience with {selectedBooking.provider_name}</p>

                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-slate-700 mb-4">Rating</label>
                            <div className="flex gap-3">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className="transition-transform hover:scale-110 focus:outline-none"
                                    >
                                        <Star 
                                            className={`w-10 h-10 transition-colors ${
                                                star <= rating 
                                                    ? 'text-amber-400 fill-amber-400' 
                                                    : 'text-slate-200 fill-transparent'
                                            }`} 
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-slate-700 mb-3">Comment (optional)</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={4}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none"
                                placeholder="Share your experience..."
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => setShowReviewModal(false)}
                                className="flex-1 bg-slate-100 text-slate-700 py-3.5 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitReview}
                                disabled={submitting}
                                className="flex-1 bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                            >
                                {submitting ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
                                ) : (
                                    <><Check className="w-5 h-5" /> Submit Review</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
