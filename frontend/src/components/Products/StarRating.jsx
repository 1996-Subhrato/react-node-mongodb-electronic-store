import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating, count, size = 16, editable = false, onRate }) => {
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) - fullStars >= 0.5;

    return (
        <div className="star-rating-container" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div className="stars" style={{ display: 'flex', gap: '2px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={size}
                        fill={star <= fullStars ? "#FFD700" : "none"}
                        color={star <= fullStars ? "#FFD700" : "#ccc"}
                        style={{ cursor: editable ? 'pointer' : 'default' }}
                        onClick={() => editable && onRate && onRate(star)}
                    />
                ))}
            </div>
            {count !== undefined && (
                <span className="rating-count" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    ({count})
                </span>
            )}
        </div>
    );
};

export default StarRating;
