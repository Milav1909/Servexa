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
        <span key={i} className={`text-2xl ${i < rating ? 'star-filled' : 'star-empty'}`}>
            ★
        </span>
    ));

    return (
        <div className="card p-6 animate-fade-in">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {reviewer_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-bold text-gray-800">{reviewer_name}</p>
                        <p className="text-sm text-gray-500">
                            {new Date(created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex gap-1 mb-3">{stars}</div>

            {comment && (
                <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl">
                    "{comment}"
                </p>
            )}
        </div>
    );
}
