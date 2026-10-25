import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Inventory from '../models/Inventory.js';
import Review from '../models/Review.js';
import Wishlist from '../models/Wishlist.js';
import Cart from '../models/Cart.js';
import RecentlyViewed from '../models/RecentlyViewed.js';
import Order from '../models/Order.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dryfruit_hub_db';

const seedData = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB.');

        // STEP 1: Safe Cleanup - Clear related collections
        console.log('Clearing old data...');
        await Category.deleteMany({});
        await Product.deleteMany({});
        await Inventory.deleteMany({});
        await Review.deleteMany({});
        await Wishlist.deleteMany({});
        await Cart.deleteMany({});
        await RecentlyViewed.deleteMany({});
        await Order.deleteMany({});
        console.log('Old data cleared.');

        // STEP 2: Insert New Categories
        console.log('Inserting categories...');
        const categories = await Category.insertMany([
            { name: 'Mobiles', description: 'Latest smartphones and mobile devices' },
            { name: 'Laptops', description: 'High-performance laptops for work and play' },
            { name: 'Headphones', description: 'Premium audio and noise-cancelling headphones' },
            { name: 'Smart Watches', description: 'Smart wearables and fitness trackers' },
            { name: 'Accessories', description: 'Essential tech accessories and gadgets' }
        ]);
        console.log('Categories inserted.');

        const getCatId = (name) => categories.find(c => c.name === name)._id;

        // STEP 3: Insert Products
        console.log('Inserting products...');
        const productsData = [
            {
                name: 'iPhone 15 Pro',
                category: getCatId('Mobiles'),
                description: 'The ultimate iPhone with Titanium design, A17 Pro chip, and advanced camera system.',
                price: 134900,
                stock_quantity: 50,
                weight: '128GB',
                image_url: '/images/products/iphone15pro.jpg',
                health_benefits: 'Dynamic Island, Always-On display, Titanium build',
                nutrition_info: 'Chip: A17 Pro, Camera: 48MP Main, Display: 6.1-inch Super Retina XDR',
                recommended_intake: 'iOS 17, USB-C support, Action button',
                ai_context_notes: 'Flagship Apple smartphone for power users.',
                is_featured: true
            },
            {
                name: 'Samsung Galaxy S23 Ultra',
                category: getCatId('Mobiles'),
                description: 'Capture every detail with the 200MP camera and enjoy peak performance with Snapdragon 8 Gen 2.',
                price: 124999,
                stock_quantity: 40,
                weight: '256GB',
                image_url: '/images/products/s23ultra.jpg',
                health_benefits: 'Built-in S Pen, 200MP sensor, 100x Space Zoom',
                nutrition_info: 'Chip: Snapdragon 8 Gen 2, Battery: 5000mAh, Display: 6.8-inch QHD+',
                recommended_intake: 'Android 13, One UI 5.1, Fast Wireless Charging 2.0',
                ai_context_notes: 'Top-tier Android phone with best-in-class camera and stylus.',
                is_featured: true
            },
            {
                name: 'MacBook Air M2',
                category: getCatId('Laptops'),
                description: 'Redesigned for power and portability. The M2 chip makes everything faster.',
                price: 114900,
                stock_quantity: 30,
                weight: '8GB RAM | 256GB SSD',
                image_url: '/images/products/macbookairm2.jpg',
                health_benefits: 'Liquid Retina display, 1080p FaceTime HD camera, MagSafe 3',
                nutrition_info: 'Processor: Apple M2, Battery: Up to 18 hours, Weight: 1.24 kg',
                recommended_intake: 'macOS Sonoma, Touch ID, Backlit Magic Keyboard',
                ai_context_notes: 'Best lightweight laptop for students and professionals.',
                is_featured: true
            },
            {
                name: 'Sony WH-1000XM5',
                category: getCatId('Headphones'),
                description: 'Industry-leading noise cancellation and exceptional sound quality.',
                price: 29990,
                stock_quantity: 100,
                weight: 'Standard',
                image_url: '/images/products/sony_xm5.jpg',
                health_benefits: 'Auto NC Optimizer, Speak-to-Chat, Multi-point connection',
                nutrition_info: 'Battery: 30 hours (ANC ON), Driver: 30mm, Weight: 250g',
                recommended_intake: 'Bluetooth 5.2, LDAC support, Alexa & Google Assistant',
                ai_context_notes: 'Premium over-ear headphones for audiophiles and travelers.',
                is_featured: true
            },
            {
                name: 'Apple Watch Series 9',
                category: getCatId('Smart Watches'),
                description: 'Smarter, brighter, and mightier. Advanced health features and carbon neutral options.',
                price: 41900,
                stock_quantity: 60,
                weight: '45mm GPS',
                image_url: '/images/products/applewatch9.jpg',
                health_benefits: 'Blood Oxygen app, ECG app, Fall Detection',
                nutrition_info: 'Chip: S9 SiP, Display: Always-On Retina 2000 nits, Battery: 18 hours',
                recommended_intake: 'watchOS 10, Double tap gesture, Fast charging',
                ai_context_notes: 'The most popular smartwatch for iPhone users with extensive fitness tracking.',
                is_featured: true
            },
            {
                name: 'Logitech MX Master 3S',
                category: getCatId('Accessories'),
                description: 'An iconic mouse remastered. Feel every moment of your workflow with even more precision.',
                price: 10995,
                stock_quantity: 150,
                weight: 'Standard',
                image_url: '/images/products/mxmaster3s.jpg',
                health_benefits: '8K DPI tracking, Quiet Click buttons, MagSpeed scrolling',
                nutrition_info: 'Battery: Up to 70 days, Connectivity: Bluetooth & Logi Bolt, Weight: 141g',
                recommended_intake: 'Logi Options+ software, Multi-device control, USB-C charging',
                ai_context_notes: 'The best productivity mouse for designers and developers.',
                is_featured: false
            }
        ];

        const insertedProducts = await Product.insertMany(productsData);
        console.log('Products inserted.');

        // STEP 4: Inventory Sync
        console.log('Syncing inventory...');
        const inventoryRecords = insertedProducts.map(product => ({
            product: product._id,
            available_stock: product.stock_quantity,
            reserved_stock: 0
        }));

        await Inventory.insertMany(inventoryRecords);
        console.log('Inventory synced.');

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
