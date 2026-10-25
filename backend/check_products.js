import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: './.env' });

const productSchema = new mongoose.Schema({
    name: String,
    image_url: String,
    images: [String]
});

const Product = mongoose.model('Product', productSchema);

async function checkProducts() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        const products = await Product.find().sort({ createdAt: -1 }).limit(5);
        console.log('Recent Products:');
        products.forEach(p => {
            console.log(`ID: ${p._id}, Name: ${p.name}, image_url: ${p.image_url}`);
        });
        
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkProducts();
