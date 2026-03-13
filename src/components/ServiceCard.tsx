import Link from 'next/link';
import { User, MapPin } from 'lucide-react';

interface ServiceCardProps {
    id: number;
    service_name: string;
    price: number;
    category: string;
    provider_name: string;
    provider_location: string;
}

export default function ServiceCard({
    id,
    service_name,
    price,
    category,
    provider_name,
    provider_location,
}: ServiceCardProps) {
    return (
        <div className="card p-6 flex flex-col h-full animate-fade-in">
            <div className="flex justify-between items-start mb-4 gap-3 border-b border-slate-100 pb-4">
                <h3 className="text-xl font-semibold text-slate-800 leading-tight">{service_name}</h3>
                <span className="badge badge-category whitespace-nowrap">
                    {category}
                </span>
            </div>

            <div className="price-tag mb-5 text-indigo-600">
                ₹{Number(price).toFixed(2)}
            </div>

            <div className="space-y-3 mb-6 flex-grow">
                <div className="flex items-center gap-3 text-slate-600">
                    <User className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-medium text-sm leading-tight">{provider_name}</span>
                </div>
                <div className="flex items-start gap-3 text-slate-500">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span className="text-sm leading-snug">{provider_location}</span>
                </div>
            </div>

            <Link
                href={`/services/${id}`}
                className="btn-primary w-full mt-auto"
            >
                View Details
            </Link>
        </div>
    );
}
