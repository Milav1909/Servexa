'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, Pencil, Trash2, Loader2, Briefcase, Check } from 'lucide-react';

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
    const [editId, setEditId] = useState<number | null>(null);
    const [serviceName, setServiceName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [customCategory, setCustomCategory] = useState('');
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
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (service: Service) => {
        setEditId(service.id);
        setServiceName(service.service_name);
        setPrice(service.price.toString());
        
        if (categories.includes(service.category)) {
            setCategory(service.category);
            setCustomCategory('');
        } else {
            setCategory('Other');
            setCustomCategory(service.category);
        }
        
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this service?')) return;

        try {
            const res = await fetch(`/api/services?id=${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setServices(services.filter(s => s.id !== id));
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to delete service');
            }
        } catch (error) {
            console.error('Error deleting service:', error);
        }
    };

    const resetForm = () => {
        setShowForm(false);
        setEditId(null);
        setServiceName('');
        setPrice('');
        setCategory('');
        setCustomCategory('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const finalCategory = category === 'Other' ? customCategory : category;

        try {
            const url = '/api/services';
            const method = editId ? 'PUT' : 'POST';
            const body = editId 
                ? { id: editId, service_name: serviceName, price: parseFloat(price), category: finalCategory }
                : { service_name: serviceName, price: parseFloat(price), category: finalCategory };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                if (editId) {
                    setServices(services.map(s => 
                        s.id === editId ? { ...s, service_name: serviceName, price: parseFloat(price), category: finalCategory } : s
                    ));
                } else {
                    const data = await res.json();
                    setServices([...services, data.service]);
                }
                resetForm();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to process service');
            }
        } catch (error) {
            console.error('Error processing service:', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="flex flex-col items-center">
                    <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
                    <p className="text-slate-500 font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-12 px-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Provider Dashboard</h1>
                    <p className="text-slate-500 mt-2 font-medium">Manage your services and grow your business</p>
                </div>
                <button
                    onClick={() => showForm ? resetForm() : setShowForm(true)}
                    className={`px-6 py-3 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2 ${showForm ? "bg-slate-100 text-slate-700 hover:bg-slate-200" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
                >
                    {showForm ? (
                        <><X className="w-5 h-5" /> Cancel</>
                    ) : (
                        <><Plus className="w-5 h-5" /> Add New Service</>
                    )}
                </button>
            </div>


            {showForm && (
                <div className="card p-8 mb-10 animate-fade-in border border-indigo-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white">
                    <h2 className="text-xl font-bold text-slate-800 mb-6">
                        {editId ? 'Edit Service' : 'Add New Service'}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Service Name</label>
                                <input
                                    type="text"
                                    value={serviceName}
                                    onChange={(e) => setServiceName(e.target.value)}
                                    required
                                    className="input-modern bg-slate-50"
                                    placeholder="e.g., Pipe Repair"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Price (₹)</label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="input-modern bg-slate-50"
                                    placeholder="99.99"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    required
                                    className="input-modern bg-slate-50"
                                >
                                    <option value="">Select category</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {category === 'Other' && (
                            <div className="mb-6 animate-fade-in">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Custom Category Name</label>
                                <input
                                    type="text"
                                    value={customCategory}
                                    onChange={(e) => setCustomCategory(e.target.value)}
                                    required
                                    className="input-modern bg-slate-50"
                                    placeholder="Enter your service category"
                                />
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-slate-900 text-white hover:bg-slate-800 py-3.5 px-8 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed min-w-[200px]"
                        >
                            {submitting ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                            ) : (
                                <><Check className="w-5 h-5" /> {editId ? 'Update Service' : 'Create Service'}</>
                            )}
                        </button>
                    </form>
                </div>
            )}


            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">My Services</h2>
                <span className="text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full text-sm">{services.length} listed</span>
            </div>

            {services.length === 0 ? (
                <div className="card py-16 px-6 text-center border-dashed border-2 border-slate-200 bg-slate-50/50">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm border border-slate-100">
                         <Briefcase className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 mb-2">No services added yet.</h3>
                    <p className="text-slate-500 mb-6 font-medium">Start offering services to get bookings.</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-sm inline-flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" /> Add Your First Service
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <div key={service.id} className="card p-6 animate-fade-in group hover:border-indigo-300 transition-all duration-300 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-bold text-slate-800 pr-2 leading-tight">
                                    {service.service_name}
                                </h3>
                                <span className="badge badge-category whitespace-nowrap shrink-0">{service.category}</span>
                            </div>
                            <div className="price-tag text-3xl mb-8 text-indigo-600">₹{Number(service.price).toFixed(2)}</div>
                            <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button
                                    onClick={() => handleEdit(service)}
                                    className="flex-1 py-2.5 px-3 bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-sm font-bold hover:bg-white hover:border-indigo-300 hover:text-indigo-600 transition flex items-center justify-center gap-2 shadow-sm"
                                >
                                    <Pencil className="w-4 h-4" /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(service.id)}
                                    className="flex-1 py-2.5 px-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-sm font-bold hover:bg-rose-100 hover:border-rose-200 transition flex items-center justify-center gap-2 shadow-sm"
                                >
                                    <Trash2 className="w-4 h-4" /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
