import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    health_benefits: {
        type: String
    },
    nutrition_info: {
        type: String
    },
    recommended_intake: {
        type: String
    },
    ai_context_notes: {
        type: String
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    image_url: {
        type: String
    },
    stock_quantity: {
        type: Number,
        required: true,
        default: 0
    },
    is_featured: {
        type: Boolean,
        default: false
    },
    weight: {
        type: String
    },
    images: [{
        type: String
    }]
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);
export default Product;
