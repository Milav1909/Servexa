'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, XCircle, AlertTriangle, Check, Mail, MapPin, Phone, Pencil, Trash2, Crosshair, X, AlertCircle } from 'lucide-react';

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
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
                    );
                    const data = await response.json();

                    if (data.address) {
                        // Auto-fill pincode from postcode
                        if (data.address.postcode) {
                            setPincode(data.address.postcode.replace(/\s/g, '').slice(0, 6));
                        }

                        // Auto-fill area/landmark from suburb, neighbourhood, or county
                        const area = data.address.suburb || data.address.neighbourhood || data.address.village || data.address.county || data.address.town || '';
                        if (area) {
                            setLandmark(area);
                        }

                        // Set address from display_name
                        if (data.display_name) {
                            setAddress(data.display_name);
                        }

                        setMessage({ type: 'success', text: 'Location detected! Pincode and area auto-filled.' });
                    } else if (data.display_name) {
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
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="flex flex-col items-center">
                    <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
                    <p className="text-slate-500 font-medium">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="card py-16 px-6 text-center max-w-md mx-auto mt-12 border-dashed border-2 border-slate-200">
                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm border border-rose-100">
                    <XCircle className="w-8 h-8 text-rose-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Profile not found</h3>
                <p className="text-slate-500">We couldn&apos;t load your profile information.</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-12 px-6">
            <div className="mb-10 text-center sm:text-left">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Profile</h1>
                <p className="text-slate-500 mt-2 font-medium">View and manage your account details</p>
            </div>

            {message.text && (
                <div className={`p-4 rounded-xl mb-8 animate-fade-in flex items-center gap-3 shadow-sm ${message.type === 'error'
                    ? 'bg-rose-50 border border-rose-200 text-rose-700'
                    : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                    }`}>
                    {message.type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0" /> : <Check className="w-5 h-5 shrink-0" />}
                    <span className="font-medium text-sm">{message.text}</span>
                </div>
            )}

            {/* Add Address Banner - Show when address is not set */}
            {!editing && profile && !profile.address && (
                <div className="bg-indigo-600 rounded-3xl p-6 sm:p-8 mb-8 text-white shadow-md relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shrink-0 border border-white/20">
                            <MapPin className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-xl mb-1">Add Your Address</h3>
                            <p className="text-indigo-100 font-medium text-sm">Add your address to see services available in your area seamlessly.</p>
                        </div>
                        <button
                            onClick={() => setEditing(true)}
                            className="bg-white text-indigo-700 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition w-full sm:w-auto text-center"
                        >
                            Add Now
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 sm:p-10">
                {/* Profile Header */}
                <div className="flex items-center gap-6 mb-10 pb-8 border-b border-slate-100">
                    <div className="w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center text-white text-4xl font-black shadow-lg shadow-slate-900/20 shrink-0">
                        {profile.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">{profile.name}</h2>
                        <p className="text-slate-500 font-medium mb-2">{profile.email}</p>
                        <p className="text-xs font-semibold text-slate-400 bg-slate-100 inline-block px-3 py-1 rounded-full">
                            Member since {new Date(profile.created_at).toLocaleDateString('en-IN', {
                                year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </p>
                    </div>
                </div>

                {editing ? (
                    /* Edit Form */
                    <form onSubmit={handleSave}>
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="input-modern bg-slate-50"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Email (cannot change)</label>
                            <input
                                type="email"
                                value={profile.email}
                                disabled
                                className="input-modern bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed"
                            />
                        </div>

                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-slate-700 mb-3">Address</label>

                            {/* Location Detection Button */}
                            <button
                                type="button"
                                onClick={detectLocation}
                                disabled={detectingLocation}
                                className="w-full mb-6 flex items-center justify-center gap-2 bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 transition shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {detectingLocation ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" /> Detecting Location...
                                    </>
                                ) : (
                                    <>
                                        <Crosshair className="w-5 h-5" /> Use My Current Location
                                    </>
                                )}
                            </button>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex-1 h-px bg-slate-200"></div>
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">or enter manually</span>
                                <div className="flex-1 h-px bg-slate-200"></div>
                            </div>

                            {/* Address Details Form */}
                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-5">
                                <h4 className="font-bold text-slate-800 text-lg">Address Details</h4>

                                {/* Pincode */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Pincode</label>
                                    <input
                                        type="text"
                                        value={pincode}
                                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-mono"
                                        placeholder="382422"
                                        maxLength={6}
                                    />
                                </div>

                                {/* House No & Floor No */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">House No.</label>
                                        <input
                                            type="text"
                                            value={houseNo}
                                            onChange={(e) => setHouseNo(e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                            placeholder="123"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Floor No.</label>
                                        <input
                                            type="text"
                                            value={floorNo}
                                            onChange={(e) => setFloorNo(e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                            placeholder="2nd"
                                        />
                                    </div>
                                </div>

                                {/* Tower No */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tower No.</label>
                                    <input
                                        type="text"
                                        value={towerNo}
                                        onChange={(e) => setTowerNo(e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                        placeholder="Tower A"
                                    />
                                </div>

                                {/* Building / Apartment Name */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Building / Apt Name</label>
                                    <input
                                        type="text"
                                        value={buildingName}
                                        onChange={(e) => setBuildingName(e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                        placeholder="Sunrise Apartments"
                                    />
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Address <span className="text-rose-500">*</span></label>
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                        placeholder="Street name, Area, City"
                                        required
                                    />
                                </div>

                                {/* Landmark / Area */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Landmark / Area <span className="text-rose-500">*</span></label>
                                    <input
                                        type="text"
                                        value={landmark}
                                        onChange={(e) => setLandmark(e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                        placeholder="Near City Mall, Main Road"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mb-10">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="input-modern bg-slate-50"
                                placeholder="+91 9876543210"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                type="button"
                                onClick={() => setEditing(false)}
                                className="flex-1 bg-slate-100 text-slate-700 py-3.5 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2 shadow-sm"
                            >
                                {saving ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
                                ) : (
                                    <><Check className="w-5 h-5" /> Save Changes</>
                                )}
                            </button>
                        </div>
                    </form>
                ) : (
                    /* View Mode */
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-5 bg-slate-50 border border-slate-100 rounded-2xl transition hover:bg-slate-100/50">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center shrink-0">
                                <Mail className="w-5 h-5 text-slate-500" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email</p>
                                <p className="font-semibold text-slate-800">{profile.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-5 bg-slate-50 border border-slate-100 rounded-2xl transition hover:bg-slate-100/50">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center shrink-0">
                                <MapPin className="w-5 h-5 text-slate-500" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Address</p>
                                <p className="font-semibold text-slate-800">{profile.address || 'Not provided'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-5 bg-slate-50 border border-slate-100 rounded-2xl transition hover:bg-slate-100/50">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center shrink-0">
                                <Phone className="w-5 h-5 text-slate-500" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Number</p>
                                <p className="font-semibold text-slate-800">{profile.phone || 'Not provided'}</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t border-slate-100">
                            <button
                                onClick={() => setEditing(true)}
                                className="flex-1 bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
                            >
                                <Pencil className="w-4 h-4" /> Edit Profile
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="flex-1 bg-rose-50 border border-rose-200 text-rose-600 py-3.5 rounded-xl font-bold hover:bg-rose-100 transition-colors flex items-center justify-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" /> Delete Account
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-3xl max-w-md w-full animate-fade-in shadow-2xl border border-slate-100">
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                 <AlertTriangle className="w-10 h-10 text-rose-600" />
                            </div>
                            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">Delete Account?</h2>
                            <p className="text-slate-500 font-medium leading-relaxed">
                                This action cannot be undone. All your bookings and reviews will be permanently deleted.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 bg-slate-100 text-slate-700 py-3.5 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex-1 bg-rose-600 text-white py-3.5 rounded-xl font-bold hover:bg-rose-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2 shadow-sm"
                            >
                                {deleting ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> Deleting...</>
                                ) : (
                                    <><Trash2 className="w-5 h-5" /> Yes, Delete</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
