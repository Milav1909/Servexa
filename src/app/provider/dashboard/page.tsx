'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Service {
    id: number;
    service_name: string;
    price: number;
    category: string;
}

export default function ProviderDashboardPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [serviceName, setServiceName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    const categories = [
        'Plumbing', 'Electrical', 'Cleaning', 'Painting',
        'HVAC', 'Carpentry', 'Landscaping', 'Moving', 'Other'
    ];

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
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

            const res = await fetch('/api/services');
            if (res.ok) {
                const data = await res.json();
                const providerServices = data.services.filter(
                    (s: { provider_id: number }) => s.provider_id === authData.user.id
                );
                setServices(providerServices);
            }
        } catch (error) {

        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const res = await fetch('/api/services', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    service_name: serviceName,
                    price: parseFloat(price),
                    category
                }),
            });

            if (res.ok) {
                const data = await res.json();
                setServices([...services, data.service]);
                setShowForm(false);
                setServiceName('');
                setPrice('');
                setCategory('');
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to create service');
            }
        } catch (error) {

        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Provider Dashboard</h1>
                    <p className="text-gray-500 mt-2">Manage your services and grow your business</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className={showForm ? "bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold" : "btn-secondary"}
                >
                    {showForm ? '✕ Cancel' : '+ Add New Service'}
                </button>
            </div>


            {showForm && (
                <div className="card p-8 mb-8 animate-fade-in">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Add New Service</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Service Name</label>
                                <input
                                    type="text"
                                    value={serviceName}
                                    onChange={(e) => setServiceName(e.target.value)}
                                    required
                                    className="input-modern"
                                    placeholder="e.g., Pipe Repair"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($)</label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="input-modern"
                                    placeholder="99.99"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    required
                                    className="input-modern"
                                >
                                    <option value="">Select category</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="btn-secondary py-4 px-8 disabled:opacity-50"
                        >
                            {submitting ? '⏳ Creating...' : '✓ Create Service'}
                        </button>
                    </form>
                </div>
            )}


            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">My Services</h2>
                <span className="text-gray-500">{services.length} services</span>
            </div>

            {services.length === 0 ? (
                <div className="card p-12 text-center">
                    <span className="text-6xl mb-4 block">🛠️</span>
                    <p className="text-xl text-gray-600 mb-4">You haven&apos;t added any services yet.</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="btn-secondary inline-block px-8"
                    >
                        Add Your First Service
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <div key={service.id} className="card p-6 animate-fade-in">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-lg font-bold text-gray-800">{service.service_name}</h3>
                                <span className="badge badge-category">{service.category}</span>
                            </div>
                            <div className="price-tag">₹{Number(service.price).toFixed(2)}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
