import { Star } from 'lucide-react';

interface ReviewCardProps {
    id: number;
    rating: number;
    comment: string | null;
    created_at: string;
    reviewer_name: string;
}

export default function ReviewCard({
    rating,
    comment,
    created_at,
    reviewer_name,
}: ReviewCardProps) {
    const stars = Array.from({ length: 5 }, (_, i) => (
        <Star
            key={i}
            className={`w-4 h-4 ${i < rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-100 text-slate-200'}`}
        />
    ));

    return (
        <div className="card p-6 h-full flex flex-col animate-fade-in">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm">
                        {reviewer_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-semibold text-slate-800 leading-tight">{reviewer_name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {new Date(created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex gap-1 mb-4">{stars}</div>

            {comment && (
                <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 border border-slate-100 p-4 rounded-2xl flex-grow">
                    "{comment}"
                </p>
            )}
        </div>
    );
}

