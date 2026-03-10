interface BookingCardProps {
    id: number;
    service_name: string;
    price: number;
    booking_date: string;
    status: 'Pending' | 'Accepted' | 'Completed';
    provider_name?: string;
    provider_location?: string;
    customer_name?: string;
    customer_email?: string;
    onStatusUpdate?: (id: number, status: string) => void;
    isProvider?: boolean;
}

export default function BookingCard({
    id,
    service_name,
    price,
    booking_date,
    status,
    provider_name,
    provider_location,
    customer_name,
    customer_email,
    onStatusUpdate,
    isProvider = false,
}: BookingCardProps) {
    const statusClass = {
        Pending: 'badge-pending',
        Accepted: 'badge-accepted',
        Completed: 'badge-completed',
    };

    return (
        <div className="card p-6 animate-fade-in">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">{service_name}</h3>
                <span className={`badge ${statusClass[status]}`}>
                    {status}
                </span>
            </div>

            <div className="price-tag mb-4">
                ₹{Number(price).toFixed(2)}
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-lg">📅</span>
                    <span className="font-medium">{new Date(booking_date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })}</span>
                </div>

                {isProvider && customer_name && (
                    <>
                        <div className="flex items-center gap-2 text-gray-600">
                            <span className="text-lg">👤</span>
                            <span className="font-medium">{customer_name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                            <span className="text-lg">✉️</span>
                            <span>{customer_email}</span>
                        </div>
                    </>
                )}

                {!isProvider && provider_name && (
                    <>
                        <div className="flex items-center gap-2 text-gray-600">
                            <span className="text-lg">🔧</span>
                            <span className="font-medium">{provider_name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                            <span className="text-lg">📍</span>
                            <span>{provider_location}</span>
                        </div>
                    </>
                )}
            </div>

            {isProvider && onStatusUpdate && status !== 'Completed' && (
                <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                    {status === 'Pending' && (
                        <button
                            onClick={() => onStatusUpdate(id, 'Accepted')}
                            className="btn-primary flex-1 text-center py-3"
                        >
                            ✓ Accept Booking
                        </button>
                    )}
                    {status === 'Accepted' && (
                        <button
                            onClick={() => onStatusUpdate(id, 'Completed')}
                            className="btn-secondary flex-1 text-center py-3"
                        >
                            ✓ Mark Complete
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
