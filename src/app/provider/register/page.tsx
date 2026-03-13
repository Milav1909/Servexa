'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Building2, AlertCircle, Lightbulb, Loader2, ChevronRight, Check } from 'lucide-react';

export default function ProviderRegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [customCategory, setCustomCategory] = useState('');
    const [location, setLocation] = useState('');
    const [pincode, setPincode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const categories = [
        'Plumbing', 'Electrical', 'Cleaning', 'Painting',
        'HVAC', 'Carpentry', 'Landscaping', 'Moving', 'Other'
    ];

    const toggleCategory = (cat: string) => {
        setSelectedCategories(prev =>
            prev.includes(cat)
                ? prev.filter(c => c !== cat)
                : [...prev, cat]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate at least one category selected
        if (selectedCategories.length === 0) {
            setError('Please select at least one service category');
            return;
        }

        // If Other is selected, custom category is required
        if (selectedCategories.includes('Other') && !customCategory.trim()) {
            setError('Please enter your specialty for Other category');
            return;
        }

        setLoading(true);

        // Combine categories - replace 'Other' with custom category
        const finalCategories = selectedCategories.map(cat =>
            cat === 'Other' ? customCategory.trim() : cat
        ).join(', ');

        try {
            const res = await fetch('/api/auth/provider/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, category: finalCategories, location, pincode }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Registration failed');
                return;
            }

            window.location.href = '/provider/dashboard';
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-lg">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-200">
                        <Building2 className="w-8 h-8 text-slate-700" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Become a Provider</h1>
                    <p className="text-slate-500 mt-2 font-medium">Start offering your services today</p>
                </div>

                {error && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl mb-6 animate-fade-in flex items-center gap-3 shadow-sm">
                         <AlertCircle className="w-5 h-5 shrink-0" />
                         <span className="font-medium text-sm">{error}</span>
                    </div>
                )}

                <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-5">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Business Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="input-modern"
                                placeholder="ABC Plumbing Services"
                            />
                        </div>

                        <div className="mb-5">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Business Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="input-modern"
                                placeholder="contact@business.com"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-baseline gap-2">
                                Service Categories 
                                <span className="text-slate-400 font-normal text-xs">(select all that apply)</span>
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {categories.map((cat) => {
                                    const isSelected = selectedCategories.includes(cat);
                                    return (
                                        <label
                                            key={cat}
                                            className={`relative flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                                isSelected
                                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                                                    : 'border-slate-200 bg-white hover:border-indigo-300 text-slate-600 hover:bg-slate-50'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => toggleCategory(cat)}
                                                className="sr-only"
                                            />
                                            {isSelected && <Check className="w-4 h-4 text-indigo-600 absolute left-3" />}
                                            <span className={`text-sm font-semibold ${isSelected ? 'pl-5' : ''}`}>{cat}</span>
                                        </label>
                                    );
                                })}
                            </div>

                            {/* Custom Specialty Input - shows when Other is selected */}
                            {selectedCategories.includes('Other') && (
                                <div className="mt-4 animate-fade-in bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <textarea
                                        value={customCategory}
                                        onChange={(e) => setCustomCategory(e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none min-h-[80px]"
                                        placeholder="Enter your services (separate multiple with commas)&#10;e.g., Interior Design, Pest Control, Home Security"
                                        required
                                        rows={3}
                                    />
                                    <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5 font-medium">
                                        <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> 
                                        You can add multiple services separated by commas
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="mb-5">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Working Area Address
                            </label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                                placeholder="Ahmedabad, Gujarat"
                                className="input-modern"
                            />
                        </div>

                        <div className="mb-5">
                            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-baseline gap-2">
                                Service Area Pincode 
                                <span className="text-slate-400 font-normal text-xs">(optional)</span>
                            </label>
                            <input
                                type="text"
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="382422"
                                maxLength={6}
                                className="input-modern font-mono"
                            />
                            <p className="text-xs text-slate-500 mt-2 font-medium">Customers in this pincode & nearby areas will see your services</p>
                        </div>

                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="input-modern"
                                placeholder="Minimum 6 characters"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-slate-900 text-white hover:bg-slate-800 w-full py-3.5 px-4 rounded-xl font-bold transition-all duration-300 shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> Creating Account...
                                </>
                            ) : (
                                <>
                                    Start Your Business <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-8 text-center space-y-3">
                    <p className="text-sm text-slate-600 font-medium">
                        Already have an account?{' '}
                        <Link href="/provider/login" className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
                            Sign in
                        </Link>
                    </p>

                    <p className="text-sm text-slate-500">
                        Are you a customer?{' '}
                        <Link href="/register" className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">
                            Customer Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
