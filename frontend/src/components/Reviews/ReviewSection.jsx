import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Send, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import StarRating from '../Products/StarRating';
import './ReviewSection.css';
import { useAuth } from '../../context/AuthContext';

const ReviewSection = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 5, text: '' });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [hasReviewed, setHasReviewed] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        fetchReviews();
        if (user) {
            checkEligibility();
        }
    }, [productId, user]);

    const checkEligibility = async () => {
        try {
            const data = await api.get(`/reviews/check/${productId}`);
            setHasReviewed(data.alreadyReviewed);
        } catch (err) {
            console.error('Error checking review eligibility:', err);
        }
    };

    const fetchReviews = async () => {
        try {
            const data = await api.get(`/reviews/${productId}`);
            setReviews(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching reviews:', err);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return alert('Please login to write a review');
        
        setSubmitting(true);
        setError(null);
        try {
            await api.post('/reviews', {
                product_id: productId,
                rating: newReview.rating,
                review_text: newReview.text
            });
            setNewReview({ rating: 5, text: '' });
            fetchReviews();
            setSubmitting(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit review. Are you a verified purchaser?');
            setSubmitting(false);
        }
    };

    return (
        <div className="review-section-container glass">
            <div className="review-header">
                <h2><MessageSquare size={22} /> Customer Reviews</h2>
                <div className="review-stats">
                    <span className="count">{reviews.length} Reviews</span>
                </div>
            </div>

            {/* Submission Form */}
            {user ? (
                !hasReviewed ? (
                    <form className="review-form glass" onSubmit={handleSubmit}>
                        <h3>Share your thoughts</h3>
                        <div className="rating-input-row">
                            <label>Your Rating:</label>
                            <StarRating 
                                rating={newReview.rating} 
                                editable={true} 
                                size={24} 
                                onRate={(r) => setNewReview({...newReview, rating: r})} 
                            />
                        </div>
                        <textarea 
                            placeholder="What did you like or dislike? How was the quality?"
                            value={newReview.text}
                            onChange={(e) => setNewReview({...newReview, text: e.target.value})}
                            required
                        />
                        {error && <div className="review-error"><AlertCircle size={14} /> {error}</div>}
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? 'Submitting...' : <><Send size={18} /> Post Review</>}
                        </button>
                    </form>
                ) : (
                    <div className="already-reviewed-msg glass">
                        <p><CheckCircle size={18} /> You have already reviewed this product. Thank you for your feedback!</p>
                    </div>
                )
            ) : (
                <div className="login-prompt glass">
                    <p>Please <button className="text-link" onClick={() => window.location.href='/login'}>Login</button> to write a review.</p>
                </div>
            )}

            {/* Reviews List */}
            <div className="reviews-list">
                {loading ? (
                    <div className="mini-loader"></div>
                ) : reviews.length === 0 ? (
                    <p className="no-reviews">No reviews yet. Be the first to share your experience!</p>
                ) : (
                    reviews.map(review => (
                        <div key={review.id} className="review-item glass">
                            <div className="review-user">
                                <div className="user-info">
                                    <span className="user-name">{review.user_name}</span>
                                    <span className="review-date">{new Date(review.created_at).toLocaleDateString()}</span>
                                </div>
                                <StarRating rating={review.rating} size={14} />
                            </div>
                            <p className="review-content">{review.review_text}</p>
                            <span className="verified-badge"><CheckCircle size={12} /> Verified Purchase</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReviewSection;
