'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import ReviewCard from '@/components/ReviewCard';
import { 
    XCircle, Building2, Phone, Star, MessageSquare, 
    Calendar, AlertCircle, CheckCircle2, Clock, 
    Lock, Check, Loader2, MapPin, Mail, ChevronRight
} from 'lucide-react';

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
    provider_phone: string | null;
}

interface Review {
    id: number;
    rating: number;
    comment: string | null;
    created_at: string;
    reviewer_name: string;
}

interface User {
    id: number;
    role: 'user' | 'provider';
}

const TIME_SLOTS = [
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '12:00 PM - 01:00 PM',
    '01:00 PM - 02:00 PM',
    '02:00 PM - 03:00 PM',
    '03:00 PM - 04:00 PM',
    '04:00 PM - 05:00 PM',
    '05:00 PM - 06:00 PM',
    '06:00 PM - 07:00 PM',
];

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [service, setService] = useState<ServiceDetail | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [bookingDate, setBookingDate] = useState('');
    const [timeSlot, setTimeSlot] = useState('');
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [reviews, setReviews] = useState<Review[]>([]);
    const [avgRating, setAvgRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [reviewsLoading, setReviewsLoading] = useState(true);
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
                // Fetch reviews once we have the provider_id
                if (data.service?.provider_id) {
                    fetchReviews(data.service.provider_id);
                }
            }
        } catch (error) {

        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async (providerId: number) => {
        try {
            const res = await fetch(`/api/reviews/${providerId}`);
            if (res.ok) {
                const data = await res.json();
                setReviews(data.reviews);
                setAvgRating(data.averageRating);
                setTotalReviews(data.totalReviews);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setReviewsLoading(false);
        }
    };

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            router.push('/login');
            return;
        }

        if (!timeSlot) {
            setMessage({ type: 'error', text: 'Please select a time slot' });
            return;
        }

        setBooking(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    service_id: parseInt(id),
                    booking_date: bookingDate,
                    time_slot: timeSlot,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage({ type: 'error', text: data.error });
                return;
            }

            setMessage({ type: 'success', text: 'Booking created successfully!' });
            setBookingDate('');
            setTimeSlot('');
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred' });

        } finally {
            setBooking(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="flex flex-col items-center">
                    <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
                    <p className="text-slate-500 font-medium">Loading service details...</p>
                </div>
            </div>
        );
    }

    if (!service) {
        return (
            <div className="text-center py-20 bg-white card max-w-md mx-auto mt-12 border border-slate-100 shadow-sm">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                     <XCircle className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Service not found</h2>
                <p className="text-slate-500 font-medium">The service you're looking for doesn't exist.</p>
                <button 
                  onClick={() => router.push('/services')} 
                  className="mt-6 text-indigo-600 font-medium hover:text-indigo-700 hover:underline"
                >
                    Return to Services
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <div className="card p-8 sm:p-10 mb-8 border border-slate-200">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-slate-100 pb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="badge badge-category whitespace-nowrap">
                                {service.category}
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2">
                           {service.service_name}
                        </h1>
                    </div>
                    <div className="price-tag text-3xl sm:text-4xl shrink-0 text-indigo-600">
                        ₹{Number(service.price).toFixed(2)}
                    </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2.5">
                        <Building2 className="w-5 h-5 text-indigo-500" />
                        Provider Information
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                        <div>
                            <span className="text-sm font-medium text-slate-500 block mb-1">Business Name</span>
                            <p className="font-semibold text-slate-800 text-lg">{service.provider_name}</p>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-slate-500 block mb-1">Specialty</span>
                            <p className="font-semibold text-slate-800 text-lg">{service.provider_category}</p>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-slate-500 block mb-1">Location</span>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                                <p className="font-medium text-slate-700">{service.provider_location}</p>
                            </div>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-slate-500 block mb-1">Email</span>
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                                <p className="font-medium text-slate-700">{service.provider_email}</p>
                            </div>
                        </div>
                        <div className="sm:col-span-2 bg-white rounded-xl p-4 border border-slate-200 flex items-center justify-between">
                            <div>
                                <span className="text-sm font-semibold text-slate-500 flex items-center gap-2 mb-1">
                                    <Phone className="w-4 h-4" /> Contact Number
                                </span>
                                <p className="font-bold text-slate-900 text-lg tracking-wide">
                                    {service.provider_phone || 'Not available'}
                                </p>
                            </div>
                            {service.provider_phone && (
                                <a href={`tel:${service.provider_phone}`} className="p-3 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
                                    <Phone className="w-5 h-5" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Provider Reviews Section */}
            <div className="card p-8 sm:p-10 mb-8 border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2.5">
                        <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                        Provider Reviews
                    </h2>
                    
                    {totalReviews > 0 && (
                        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-0.5">
                                {Array.from({ length: 5 }, (_, i) => (
                                    <Star 
                                        key={i} 
                                        className={`w-4 h-4 ${i < Math.round(avgRating) ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`} 
                                    />
                                ))}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-lg font-bold text-slate-800">{Number(avgRating).toFixed(1)}</span>
                                <span className="text-slate-500 text-sm font-medium">({totalReviews})</span>
                            </div>
                        </div>
                    )}
                </div>

                {reviewsLoading ? (
                    <div className="text-center py-12">
                        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-3" />
                        <p className="text-slate-500 font-medium">Loading reviews...</p>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                            <MessageSquare className="w-5 h-5 text-slate-300" />
                        </div>
                        <p className="text-slate-500 font-medium">No reviews yet for this provider.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {reviews.map((review) => (
                            <ReviewCard key={review.id} {...review} />
                        ))}
                    </div>
                )}
            </div>

            {user?.role === 'user' && (
                <div className="card p-8 sm:p-10 border border-slate-200 relative overflow-hidden">
                    {/* Background accent */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mx-20 -my-20 pointer-events-none"></div>
                    
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                                <Calendar className="w-5 h-5" />
                            </div>
                            Book This Service
                        </h2>

                        {message.text && (
                            <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 animate-fade-in ${message.type === 'error'
                                ? 'bg-rose-50 border border-rose-200 text-rose-800'
                                : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                                }`}>
                                {message.type === 'error' ? (
                                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
                                ) : (
                                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-500" />
                                )}
                                <span className="font-medium text-sm leading-relaxed">{message.text}</span>
                            </div>
                        )}

                        <form onSubmit={handleBooking}>
                            <div className="mb-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                                <label className="block text-sm font-bold text-slate-700 mb-3">
                                    Select Date
                                </label>
                                <input
                                    type="date"
                                    value={bookingDate}
                                    onChange={(e) => setBookingDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                    className="input-modern bg-slate-50"
                                />
                            </div>

                            <div className="mb-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                                <label className="block text-sm font-bold text-slate-700 mb-3">
                                    Select Time Slot
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {TIME_SLOTS.map((slot) => (
                                        <button
                                            key={slot}
                                            type="button"
                                            onClick={() => setTimeSlot(slot)}
                                            className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 border-2 flex items-center justify-center gap-2 ${timeSlot === slot
                                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200/50'
                                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-white hover:text-indigo-600'
                                                }`}
                                        >
                                            <Clock className={`w-4 h-4 ${timeSlot === slot ? 'text-indigo-200' : 'text-slate-400'}`} /> 
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={booking}
                                className="w-full bg-slate-900 text-white hover:bg-slate-800 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                            >
                                {booking ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                                    </>
                                ) : (
                                    <>
                                        Confirm Booking <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {!user && (
                <div className="card p-10 text-center bg-slate-50 border border-slate-200 shadow-sm mt-8">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm border border-slate-100">
                        <Lock className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Authentication Required</h3>
                    <p className="text-slate-500 font-medium mb-8 max-w-sm mx-auto">Please sign in to your customer account to book this service.</p>
                    <a href="/login" className="btn-primary inline-flex px-8 py-3.5 items-center gap-2">
                        Sign In <ChevronRight className="w-4 h-4" />
                    </a>
                </div>
            )}
        </div>
    );
}
