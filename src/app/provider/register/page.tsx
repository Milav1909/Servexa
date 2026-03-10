'use client';

import { useState } from 'react';
import Link from 'next/link';

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
        <div className="min-h-[80vh] flex items-center justify-center py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">🏢</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">Become a Provider</h1>
                    <p className="text-gray-500 mt-2">Start offering your services today</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 animate-fade-in">
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="card p-8">
                    <div className="mb-5">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
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

                    <div className="mb-5">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Service Categories <span className="text-gray-400 font-normal">(select all that apply)</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {categories.map((cat) => (
                                <label
                                    key={cat}
                                    className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedCategories.includes(cat)
                                        ? 'border-green-500 bg-green-50 text-green-700'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(cat)}
                                        onChange={() => toggleCategory(cat)}
                                        className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                                    />
                                    <span className="text-sm font-medium">{cat}</span>
                                </label>
                            ))}
                        </div>

                        {/* Custom Specialty Input - shows when Other is selected */}
                        {selectedCategories.includes('Other') && (
                            <div className="mt-3 animate-fade-in">
                                <textarea
                                    value={customCategory}
                                    onChange={(e) => setCustomCategory(e.target.value)}
                                    className="input-modern min-h-[80px] resize-none"
                                    placeholder="Enter your services (separate multiple with commas)&#10;e.g., Interior Design, Pest Control, Home Security"
                                    required
                                    rows={3}
                                />
                                <p className="text-xs text-gray-500 mt-1">💡 You can add multiple services separated by commas</p>
                            </div>
                        )}
                    </div>

                    <div className="mb-5">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Service Area Pincode <span className="text-gray-400 font-normal">(optional)</span>
                        </label>
                        <input
                            type="text"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="382422"
                            maxLength={6}
                            className="input-modern"
                        />
                        <p className="text-xs text-gray-500 mt-1">Customers in this pincode & nearby areas will see your services</p>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                        className="btn-secondary w-full py-4 text-lg disabled:opacity-50"
                    >
                        {loading ? '⏳ Creating Account...' : '🚀 Start Your Business'}
                    </button>
                </form>

                <p className="text-center mt-6 text-gray-600">
                    Already have an account?{' '}
                    <Link href="/provider/login" className="text-green-600 font-semibold hover:underline">
                        Sign in
                    </Link>
                </p>

                <p className="text-center mt-3 text-gray-500">
                    Are you a customer?{' '}
                    <Link href="/register" className="text-purple-600 font-semibold hover:underline">
                        Customer Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}
