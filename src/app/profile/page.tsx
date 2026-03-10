'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Profile {
    id: number;
    name: string;
    email: string;
    address: string | null;
    phone: string | null;
    created_at: string;
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Form fields
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [detectingLocation, setDetectingLocation] = useState(false);

    // Detailed address fields
    const [pincode, setPincode] = useState('');
    const [houseNo, setHouseNo] = useState('');
    const [floorNo, setFloorNo] = useState('');
    const [towerNo, setTowerNo] = useState('');
    const [buildingName, setBuildingName] = useState('');
    const [landmark, setLandmark] = useState('');

    const router = useRouter();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const authRes = await fetch('/api/auth/me');
            if (!authRes.ok) {
                router.push('/login');
                return;
            }

            const res = await fetch('/api/profile');
            if (res.ok) {
                const data = await res.json();
                setProfile(data.profile);
                setName(data.profile.name);
                setAddress(data.profile.address || '');
                setPhone(data.profile.phone || '');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    // Detect user location using browser Geolocation API
    const detectLocation = () => {
        if (!navigator.geolocation) {
            setMessage({ type: 'error', text: 'Geolocation is not supported by your browser' });
            return;
        }

        setDetectingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    // Use reverse geocoding to get address from coordinates
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await response.json();

                    if (data.display_name) {
                        setAddress(data.display_name);
                        setMessage({ type: 'success', text: 'Location detected successfully!' });
                    } else {
                        setAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                    }
                } catch (error) {
                    console.error('Geocoding error:', error);
                    setMessage({ type: 'error', text: 'Could not get address from location' });
                } finally {
                    setDetectingLocation(false);
                }
            },
            (error) => {
                setDetectingLocation(false);
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setMessage({ type: 'error', text: 'Location permission denied. Please enable it in browser settings.' });
                        break;
                    case error.POSITION_UNAVAILABLE:
                        setMessage({ type: 'error', text: 'Location information unavailable.' });
                        break;
                    case error.TIMEOUT:
                        setMessage({ type: 'error', text: 'Location request timed out.' });
                        break;
                    default:
                        setMessage({ type: 'error', text: 'An error occurred while detecting location.' });
                }
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        // Combine address fields into full address
        const addressParts = [
            houseNo && `House ${houseNo}`,
            floorNo && `Floor ${floorNo}`,
            towerNo && `Tower ${towerNo}`,
            buildingName,
            address,
            landmark,
            pincode && `Pincode: ${pincode}`
        ].filter(Boolean);
        const fullAddress = addressParts.join(', ');

        try {
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, address: fullAddress, phone }),
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                setEditing(false);
                fetchProfile();
            } else {
                const data = await res.json();
                setMessage({ type: 'error', text: data.error || 'Update failed' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred' });
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);

        try {
            const res = await fetch('/api/profile', { method: 'DELETE' });

            if (res.ok) {
                await fetch('/api/auth/logout', { method: 'POST' });
                window.location.href = '/';
            } else {
                const data = await res.json();
                alert(data.error || 'Delete failed');
            }
        } catch (error) {
            console.error('Delete error:', error);
        } finally {
            setDeleting(false);
            setShowDeleteModal(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="card p-12 text-center max-w-md mx-auto">
                <span className="text-6xl mb-4 block">❌</span>
                <p className="text-xl text-gray-600">Profile not found</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
                <p className="text-gray-500 mt-2">View and manage your account details</p>
            </div>

            {message.text && (
                <div className={`p-4 rounded-xl mb-6 animate-fade-in ${message.type === 'error'
                    ? 'bg-red-50 border border-red-200 text-red-700'
                    : 'bg-green-50 border border-green-200 text-green-700'
                    }`}>
                    {message.type === 'error' ? '⚠️' : '✓'} {message.text}
                </div>
            )}

            {/* Add Address Banner - Show when address is not set */}
            {!editing && profile && !profile.address && (
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-6 mb-6 text-white animate-fade-in">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-lg">Add Your Address</h3>
                            <p className="text-purple-100 text-sm">Add your address to see services available in your area</p>
                        </div>
                        <button
                            onClick={() => setEditing(true)}
                            className="bg-white text-purple-600 px-5 py-2.5 rounded-xl font-semibold hover:bg-purple-50 transition"
                        >
                            Add Now
                        </button>
                    </div>
                </div>
            )}

            <div className="card p-8">
                {/* Profile Header */}
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
                        {profile.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{profile.name}</h2>
                        <p className="text-gray-500">{profile.email}</p>
                        <p className="text-sm text-gray-400 mt-1">
                            Member since {new Date(profile.created_at).toLocaleDateString('en-IN', {
                                year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </p>
                    </div>
                </div>

                {editing ? (
                    /* Edit Form */
                    <form onSubmit={handleSave}>
                        <div className="mb-5">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="input-modern"
                            />
                        </div>

                        <div className="mb-5">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email (cannot change)</label>
                            <input
                                type="email"
                                value={profile.email}
                                disabled
                                className="input-modern bg-gray-100 cursor-not-allowed"
                            />
                        </div>

                        <div className="mb-5">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>

                            {/* Location Detection Button */}
                            <button
                                type="button"
                                onClick={detectLocation}
                                disabled={detectingLocation}
                                className="w-full mb-3 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition disabled:opacity-50"
                            >
                                {detectingLocation ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Detecting Location...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Use My Current Location
                                    </>
                                )}
                            </button>

                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex-1 h-px bg-gray-200"></div>
                                <span className="text-sm text-gray-400">or enter manually</span>
                                <div className="flex-1 h-px bg-gray-200"></div>
                            </div>

                            {/* Address Details Form */}
                            <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                                <h4 className="font-semibold text-gray-800">Address Details</h4>

                                {/* Pincode */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Pincode</label>
                                    <input
                                        type="text"
                                        value={pincode}
                                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        className="input-modern"
                                        placeholder="382422"
                                        maxLength={6}
                                    />
                                </div>

                                {/* House No & Floor No */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">House No.</label>
                                        <input
                                            type="text"
                                            value={houseNo}
                                            onChange={(e) => setHouseNo(e.target.value)}
                                            className="input-modern"
                                            placeholder="123"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Floor No.</label>
                                        <input
                                            type="text"
                                            value={floorNo}
                                            onChange={(e) => setFloorNo(e.target.value)}
                                            className="input-modern"
                                            placeholder="2nd"
                                        />
                                    </div>
                                </div>

                                {/* Tower No */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Tower No.</label>
                                    <input
                                        type="text"
                                        value={towerNo}
                                        onChange={(e) => setTowerNo(e.target.value)}
                                        className="input-modern"
                                        placeholder="Tower A"
                                    />
                                </div>

                                {/* Building / Apartment Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Building / Apartment Name</label>
                                    <input
                                        type="text"
                                        value={buildingName}
                                        onChange={(e) => setBuildingName(e.target.value)}
                                        className="input-modern"
                                        placeholder="Sunrise Apartments"
                                    />
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Address <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="input-modern"
                                        placeholder="Street name, Area, City"
                                        required
                                    />
                                </div>

                                {/* Landmark / Area */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Landmark / Area <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={landmark}
                                        onChange={(e) => setLandmark(e.target.value)}
                                        className="input-modern"
                                        placeholder="Near City Mall, Main Road"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="input-modern"
                                placeholder="+91 9876543210"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setEditing(false)}
                                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 btn-primary py-3 disabled:opacity-50"
                            >
                                {saving ? '⏳ Saving...' : '✓ Save Changes'}
                            </button>
                        </div>
                    </form>
                ) : (
                    /* View Mode */
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                            <span className="text-2xl">📧</span>
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-semibold text-gray-800">{profile.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                            <span className="text-2xl">📍</span>
                            <div>
                                <p className="text-sm text-gray-500">Address</p>
                                <p className="font-semibold text-gray-800">{profile.address || 'Not provided'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                            <span className="text-2xl">📱</span>
                            <div>
                                <p className="text-sm text-gray-500">Phone Number</p>
                                <p className="font-semibold text-gray-800">{profile.phone || 'Not provided'}</p>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6 pt-6 border-t border-gray-100">
                            <button
                                onClick={() => setEditing(true)}
                                className="flex-1 btn-primary py-3"
                            >
                                ✏️ Edit Profile
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="flex-1 bg-red-50 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-100 transition"
                            >
                                🗑️ Delete Account
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="card p-8 max-w-md w-full mx-4 animate-fade-in">
                        <div className="text-center mb-6">
                            <span className="text-6xl mb-4 block">⚠️</span>
                            <h2 className="text-2xl font-bold text-gray-800">Delete Account?</h2>
                            <p className="text-gray-500 mt-2">
                                This action cannot be undone. All your bookings and reviews will be permanently deleted.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-50"
                            >
                                {deleting ? '⏳ Deleting...' : '🗑️ Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
