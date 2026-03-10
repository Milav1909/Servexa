import Link from 'next/link';

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
        <div className="card p-6 animate-fade-in">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">{service_name}</h3>
                <span className="badge badge-category">
                    {category}
                </span>
            </div>

            <div className="price-tag mb-4">
                ₹{Number(price).toFixed(2)}
            </div>

            <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-lg">👤</span>
                    <span className="font-medium">{provider_name}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                    <span className="text-lg">📍</span>
                    <span>{provider_location}</span>
                </div>
            </div>

            <Link
                href={`/services/${id}`}
                className="btn-primary block text-center w-full"
            >
                View Details
            </Link>
        </div>
    );
}
