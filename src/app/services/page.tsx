'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ServiceCard from '@/components/ServiceCard';

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
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600">Checking authentication...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="hero-gradient text-white py-16 -mt-8 mb-12">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h1 className="text-5xl font-bold mb-4">
                        Find Local Services
                    </h1>
                    <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                        {userPincode
                            ? `Showing services near pincode ${userPincode} and nearby areas`
                            : 'Connect with trusted professionals in your area. Book plumbers, electricians, cleaners, and more!'
                        }
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search services, plumbers, electricians..."
                                className="w-full px-6 py-4 pl-14 rounded-2xl text-gray-800 bg-white shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-300 text-lg"
                            />
                            <svg className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Address Banner - Show when no address */}
            {!hasAddress && (
                <div className="max-w-7xl mx-auto px-6 mb-8">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-5 text-white">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg">Add Your Address</h3>
                                <p className="text-amber-100 text-sm">Add your pincode to see services available in your area only</p>
                            </div>
                            <Link
                                href="/profile"
                                className="bg-white text-orange-600 px-5 py-2.5 rounded-xl font-semibold hover:bg-orange-50 transition"
                            >
                                Add Address
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Location Indicator - Show when pincode is set */}
            {userPincode && (
                <div className="max-w-7xl mx-auto px-6 mb-6">
                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Showing services for pincode: {userPincode} & nearby areas
                    </div>
                </div>
            )}

            {/* Services Grid */}
            <div className="max-w-7xl mx-auto px-6 pb-16">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {searchQuery ? `Results for "${searchQuery}"` : userPincode ? 'Services Near You' : 'All Services'}
                    </h2>
                    <span className="text-gray-500">
                        {filteredServices.length} services found
                    </span>
                </div>

                {loading ? (
                    <div className="text-center py-16">
                        <div className="inline-block w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-gray-600">Loading services...</p>
                    </div>
                ) : filteredServices.length === 0 ? (
                    <div className="text-center py-16 card">
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <p className="text-xl text-gray-600">No services found{searchQuery && ` for "${searchQuery}"`}</p>
                        <p className="text-gray-400 mt-2">Try a different search term</p>
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
