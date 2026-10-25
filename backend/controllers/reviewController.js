import Review from '../models/Review.js';
import Order from '../models/Order.js';

export const addReview = async (req, res, next) => {
    try {
        const { product_id, rating, review_text } = req.body;
        const user_id = req.user.id;

        // 1. Strict Eligibility Check: Must have a Delivered order containing this product
        const purchase = await Order.findOne({
            user: user_id,
            order_status: 'Delivered',
            'items.product': product_id
        });

        if (!purchase) {
            return res.status(403).json({ message: 'You can only review products from delivered orders.' });
        }

        // 2. Check if already reviewed (Prevent duplicates)
        const existing = await Review.findOne({ user: user_id, product: product_id });
        if (existing) {
            return res.status(400).json({ message: 'You have already reviewed this product. Please edit your existing review.' });
        }

        // 3. Add Review
        await Review.create({
            user: user_id,
            product: product_id,
            rating,
            review_text
        });

        res.status(201).json({ message: 'Review submitted successfully.' });
    } catch (error) {
        next(error);
    }
};

export const updateReview = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { rating, review_text } = req.body;
        const user_id = req.user.id;

        const review = await Review.findOne({ _id: id, user: user_id });
        if (!review) {
            return res.status(403).json({ message: 'You can only edit your own reviews.' });
        }

        review.rating = rating;
        review.review_text = review_text;
        await review.save();

        res.json({ message: 'Review updated successfully.' });
    } catch (error) {
        next(error);
    }
};

export const checkReviewEligibility = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const user_id = req.user.id;

        // 1. Check if purchased and delivered
        const purchase = await Order.findOne({
            user: user_id,
            order_status: 'Delivered',
            'items.product': productId
        });
        const isEligible = !!purchase;

        // 2. Check for existing review
        const review = await Review.findOne({ user: user_id, product: productId });

        res.json({
            isEligible,
            alreadyReviewed: !!review,
            review: review ? {
                id: review._id,
                rating: review.rating,
                review_text: review.review_text
            } : null
        });
    } catch (error) {
        next(error);
    }
};

export const getProductReviews = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const reviews = await Review.find({ product: productId })
            .populate('user', 'name')
            .sort({ createdAt: -1 });
            
        res.json(reviews.map(r => ({
            id: r._id,
            user_id: r.user?._id,
            user_name: r.user?.name,
            rating: r.rating,
            review_text: r.review_text,
            created_at: r.createdAt
        })));
    } catch (error) {
        next(error);
    }
};

export const deleteReview = async (req, res, next) => {
    try {
        const { id } = req.params;
        await Review.findByIdAndDelete(id);
        res.json({ message: 'Review deleted by administrator.' });
    } catch (error) {
        next(error);
    }
};

