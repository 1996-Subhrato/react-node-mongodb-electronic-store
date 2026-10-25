import React, { useState, useEffect } from 'react';
import { Star, X, MessageSquare } from 'lucide-react';
import './ReviewModal.css';

const ReviewModal = ({ isOpen, onClose, onSubmit, product, existingReview }) => {
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState('');
    const [hoverRating, setHoverRating] = useState(0);

    useEffect(() => {
        if (existingReview) {
            setRating(existingReview.rating);
            setReviewText(existingReview.review_text || '');
        } else {
            setRating(5);
            setReviewText('');
        }
    }, [existingReview, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ 
            rating, 
            review_text: reviewText, 
            product_id: product.product_id,
            isUpdate: !!existingReview,
            review_id: existingReview?.review_id 
        });
    };

    return (
        <div className="review-modal-overlay">
            <div className="review-modal-content animate-slideUp">
                <button className="close-btn" onClick={onClose}>
                    <X size={20} />
                </button>
                
                <div className="review-modal-header">
                    <div className="product-brief">
                        <img src={`http://localhost:5000${product.image_url}`} alt={product.name} />
                        <div>
                            <h3>{existingReview ? 'Edit Your Review' : 'Write a Review'}</h3>
                            <p>{product.name}</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="review-form">
                    <div className="rating-section">
                        <label>How would you rate this product?</label>
                        <div className="star-rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={32}
                                    className={`star ${ (hoverRating || rating) >= star ? 'filled' : ''}`}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                />
                            ))}
                        </div>
                        <span className="rating-label">
                            {['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating - 1]}
                        </span>
                    </div>

                    <div className="text-section">
                        <label>
                            <MessageSquare size={16} /> Share your experience
                        </label>
                        <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="What did you like or dislike? How was the quality?"
                            required
                        ></textarea>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="review-cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="submit-btn-premium">
                            {existingReview ? 'Update Review' : 'Submit Review'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;
