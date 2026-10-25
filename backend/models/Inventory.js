import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
        unique: true
    },
    available_stock: {
        type: Number,
        default: 0
    },
    reserved_stock: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Inventory = mongoose.model('Inventory', inventorySchema);
export default Inventory;
