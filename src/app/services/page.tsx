'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ServiceCard from '@/components/ServiceCard';
import { Search, MapPin, Inbox, Loader2, Map } from 'lucide-react';

interface Service {
    id: number;
    provider_id: number;
    service_name: string;
    price: number;
    category: string;
    provider_name: string;
    provider_location: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    role: 'user' | 'provider';
}

interface UserProfile {
    address: string | null;
}

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [userPincode, setUserPincode] = useState<string | null>(null);
    const [hasAddress, setHasAddress] = useState(true);
    const [authChecking, setAuthChecking] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        if (user) {
            fetchUserProfile();
            fetchCategories();
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchServices();
        }
    }, [selectedCategory, userPincode]);

    const checkAuth = async () => {
        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                router.push('/login');
            }
        } catch (error) {
            console.error('Auth check error:', error);
            router.push('/login');
        } finally {
            setAuthChecking(false);
        }
    };

    const fetchUserProfile = async () => {
        try {
            const res = await fetch('/api/profile');
            if (res.ok) {
                const data = await res.json();
                const profile: UserProfile = data.profile;

                if (profile.address) {
                    setHasAddress(true);
                    // Extract pincode from address (assumes format: "..., Pincode: XXXXXX")
                    const pincodeMatch = profile.address.match(/Pincode:\s*(\d{6})/i);
                    if (pincodeMatch) {
                        setUserPincode(pincodeMatch[1]);
                    } else {
                        // Try to find any 6-digit number as pincode
                        const anyPincode = profile.address.match(/\b(\d{6})\b/);
                        if (anyPincode) {
                            setUserPincode(anyPincode[1]);
                        }
                    }
                } else {
                    setHasAddress(false);
                }
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/services/categories');
            if (res.ok) {
                const data = await res.json();
                setCategories(data.categories);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchServices = async () => {
        try {
            const params = new URLSearchParams();
            if (selectedCategory) params.append('category', selectedCategory);
            if (userPincode) params.append('pincode', userPincode);

            const url = `/api/services${params.toString() ? '?' + params.toString() : ''}`;
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setServices(data.services);
            }
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter services based on search query
    const filteredServices = services.filter(service => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return (
            service.service_name.toLowerCase().includes(query) ||
            service.category.toLowerCase().includes(query) ||
            service.provider_name.toLowerCase().includes(query) ||
            service.provider_location.toLowerCase().includes(query)
        );
    });

    if (authChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto mb-4" />
                    <p className="text-slate-600 font-medium">Authenticating...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen pb-16">
            {/* Hero Section */}
            <div className="bg-white border-b border-slate-200 pt-12 pb-16 mb-10">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                        Find Local Services
                    </h1>
                    <p className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto font-medium">
                        {userPincode
                            ? `Showing services near pincode ${userPincode} and nearby areas`
                            : 'Connect with trusted professionals in your area.'
                        }
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto">
                        <div className="relative group">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search services, categories, or providers..."
                                className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-200 text-slate-900 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-base transition-all duration-300"
                            />
                            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Address Banner - Show when no address */}
            {!hasAddress && (
                <div className="max-w-7xl mx-auto px-6 mb-8">
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-amber-900 shadow-sm">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className="w-12 h-12 bg-amber-100/50 rounded-xl flex items-center justify-center shrink-0">
                                <Map className="w-6 h-6 text-amber-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg text-amber-900">Add Your Address</h3>
                                <p className="text-amber-700 text-sm mt-0.5 font-medium">We need your pincode to show services available specifically in your area.</p>
                            </div>
                            <Link
                                href="/profile"
                                className="bg-amber-600 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-amber-700 transition shadow-sm whitespace-nowrap"
                            >
                                Update Profile
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Location Indicator - Show when pincode is set */}
            {userPincode && (
                <div className="max-w-7xl mx-auto px-6 mb-8">
                    <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-2.5 rounded-full text-sm font-semibold shadow-sm">
                        <MapPin className="w-4 h-4" />
                        Showing services for pincode: {userPincode} & nearby areas
                    </div>
                </div>
            )}

            {/* Services Grid */}
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                        {searchQuery ? `Results for "${searchQuery}"` : userPincode ? 'Services Near You' : 'All Services'}
                    </h2>
                    <span className="text-slate-500 font-medium text-sm">
                        {filteredServices.length} {filteredServices.length === 1 ? 'service' : 'services'} found
                    </span>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto mb-4" />
                        <p className="text-slate-500 font-medium">Loading available services...</p>
                    </div>
                ) : filteredServices.length === 0 ? (
                    <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl shadow-sm">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                             <Inbox className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="text-xl font-semibold text-slate-700 mb-2">No services found{searchQuery && ` for "${searchQuery}"`}</p>
                        <p className="text-slate-500 font-medium">Try adjusting your search terms or location settings.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredServices.map((service) => (
                            <ServiceCard key={service.id} {...service} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

