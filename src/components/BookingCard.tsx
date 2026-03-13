import { Calendar, Clock, User, Mail, Wrench, MapPin, Check, X } from 'lucide-react';

interface BookingCardProps {
    id: number;
    service_name: string;
    price: number;
    booking_date: string;
    time_slot?: string | null;
    status: 'Pending' | 'Accepted' | 'Completed';
    provider_name?: string;
    provider_location?: string;
    customer_name?: string;
    customer_email?: string;
    onStatusUpdate?: (id: number, status: string) => void;
    onCancel?: (id: number) => void;
    isProvider?: boolean;
}

export default function BookingCard({
    id,
    service_name,
    price,
    booking_date,
    time_slot,
    status,
    provider_name,
    provider_location,
    customer_name,
    customer_email,
    onStatusUpdate,
    onCancel,
    isProvider = false,
}: BookingCardProps) {
    const statusClass = {
        Pending: 'badge-pending',
        Accepted: 'badge-accepted',
        Completed: 'badge-completed',
    };

    return (
        <div className="card p-6 flex flex-col h-full animate-fade-in">
            <div className="flex justify-between items-start mb-4 gap-4 border-b border-slate-100 pb-4">
                <h3 className="text-xl font-semibold text-slate-800 leading-tight">{service_name}</h3>
                <span className={`badge shrink-0 ${statusClass[status]}`}>
                    {status}
                </span>
            </div>

            <div className="price-tag mb-5 text-indigo-600">
                ₹{Number(price).toFixed(2)}
            </div>

            <div className="space-y-3 mb-6 flex-grow">
                <div className="flex items-center gap-3 text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-medium text-sm">
                        {new Date(booking_date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}
                    </span>
                </div>

                {time_slot && (
                    <div className="flex items-center gap-3 text-slate-600">
                        <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="font-medium text-sm">{time_slot}</span>
                    </div>
                )}

                {isProvider && customer_name && (
                    <div className="pt-3 mt-3 border-t border-slate-100 space-y-3">
                        <div className="flex items-center gap-3 text-slate-600">
                            <User className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="font-medium text-sm">{customer_name}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-500">
                            <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="text-sm">{customer_email}</span>
                        </div>
                    </div>
                )}

                {!isProvider && provider_name && (
                    <div className="pt-3 mt-3 border-t border-slate-100 space-y-3">
                        <div className="flex items-center gap-3 text-slate-600">
                            <Wrench className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="font-medium text-sm">{provider_name}</span>
                        </div>
                        <div className="flex items-start gap-3 text-slate-500">
                            <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                            <span className="text-sm leading-snug">{provider_location}</span>
                        </div>
                    </div>
                )}
            </div>

            {!isProvider && onCancel && status === 'Pending' && (
                <div className="mt-auto pt-4 border-t border-slate-100">
                    <button
                        onClick={() => onCancel(id)}
                        className="w-full py-2.5 px-4 rounded-full text-rose-600 font-medium border border-rose-200 hover:bg-rose-50 hover:border-rose-300 transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                    >
                        <X className="w-4 h-4" /> Cancel Booking
                    </button>
                </div>
            )}

            {isProvider && onStatusUpdate && status !== 'Completed' && (
                <div className="mt-auto pt-4 border-t border-slate-100 flex gap-3">
                    {status === 'Pending' && (
                        <button
                            onClick={() => onStatusUpdate(id, 'Accepted')}
                            className="btn-primary flex-1 py-2.5 text-sm"
                        >
                            <Check className="w-4 h-4" /> Accept
                        </button>
                    )}
                    {status === 'Accepted' && (
                        <button
                            onClick={() => onStatusUpdate(id, 'Completed')}
                            className="btn-secondary flex-1 py-2.5 text-sm"
                        >
                            <Check className="w-4 h-4" /> Complete
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

