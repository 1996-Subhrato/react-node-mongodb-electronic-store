import mongoose from 'mongoose';

const recentlyViewedSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    viewed_at: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

recentlyViewedSchema.index({ user: 1, product: 1 }, { unique: true });

const RecentlyViewed = mongoose.model('RecentlyViewed', recentlyViewedSchema);
export default RecentlyViewed;
