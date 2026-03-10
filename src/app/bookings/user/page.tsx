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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">My Bookings</h1>
                <p className="text-gray-500 mt-2">View and manage your service bookings</p>
            </div>

            {bookings.length === 0 ? (
                <div className="card p-12 text-center">
                    <span className="text-6xl mb-4 block">📭</span>
                    <p className="text-xl text-gray-600 mb-4">You haven&apos;t made any bookings yet.</p>
                    <a href="/" className="btn-primary inline-block px-8">
                        Browse Services
                    </a>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="relative">
                            <BookingCard {...booking} />
                            {booking.status === 'Completed' && (
                                <button
                                    onClick={() => openReviewModal(booking)}
                                    className="mt-3 w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition"
                                >
                                    ⭐ Leave a Review
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Review Modal */}
            {showReviewModal && selectedBooking && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="card p-8 max-w-md w-full mx-4 animate-fade-in">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Leave a Review</h2>
                        <p className="text-gray-500 mb-6">Rate your experience with {selectedBooking.provider_name}</p>

                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Rating</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className={`text-4xl transition transform hover:scale-110 ${star <= rating ? 'star-filled' : 'star-empty'
                                            }`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Comment (optional)</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={4}
                                className="input-modern resize-none"
                                placeholder="Share your experience..."
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowReviewModal(false)}
                                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitReview}
                                disabled={submitting}
                                className="flex-1 btn-secondary py-3 disabled:opacity-50"
                            >
                                {submitting ? '⏳ Submitting...' : '✓ Submit Review'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
