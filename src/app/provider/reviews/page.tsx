'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReviewCard from '@/components/ReviewCard';

interface Review {
    id: number;
    rating: number;
    comment: string | null;
    created_at: string;
    reviewer_name: string;
}

export default function ProviderReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [avgRating, setAvgRating] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
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

            const res = await fetch(`/api/reviews/provider/${authData.user.id}`);
            if (res.ok) {
                const data = await res.json();
                setReviews(data.reviews);
                setAvgRating(data.avgRating);
            }
        } catch (error) {

        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
        rating,
        count: reviews.filter(r => r.rating === rating).length,
        percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 : 0
    }));

    return (
        <div className="max-w-6xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Customer Reviews</h1>
                <p className="text-gray-500 mt-2">See what customers are saying about your services</p>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="card p-8 text-center bg-gradient-to-br from-yellow-50 to-orange-50">
                    <div className="text-6xl font-bold text-yellow-500 mb-2">
                        {avgRating ? avgRating.toFixed(1) : 'N/A'}
                    </div>
                    <div className="flex justify-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={`text-2xl ${!avgRating || star <= Math.round(avgRating) ? 'star-filled' : 'star-empty'}`}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    <p className="text-gray-600">Average Rating</p>
                    <p className="text-sm text-gray-500 mt-1">{reviews.length} total reviews</p>
                </div>

                <div className="card p-8">
                    <h3 className="font-bold text-gray-700 mb-4">Rating Distribution</h3>
                    {ratingDistribution.map(({ rating, count, percentage }) => (
                        <div key={rating} className="flex items-center gap-3 mb-2">
                            <span className="w-8 text-sm font-medium text-gray-600">{rating} ★</span>
                            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                            <span className="w-8 text-sm text-gray-500">{count}</span>
                        </div>
                    ))}
                </div>
            </div>


            {reviews.length === 0 ? (
                <div className="card p-12 text-center">
                    <span className="text-6xl mb-4 block">⭐</span>
                    <p className="text-xl text-gray-600">No reviews yet. Complete bookings to receive reviews!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reviews.map((review) => (
                        <ReviewCard key={review.id} {...review} />
                    ))}
                </div>
            )}
        </div>
    );
}
