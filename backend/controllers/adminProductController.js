import Product from '../models/Product.js';
import Inventory from '../models/Inventory.js';
import Category from '../models/Category.js';
import fs from 'fs';

export const getAdminProducts = async (req, res, next) => {
    try {
        const products = await Product.find().populate('category', 'name');
        res.json(products.map(p => ({
            id: p._id,
            name: p.name,
            description: p.description,
            price: p.price,
            stock_quantity: p.stock_quantity,
            weight: p.weight,
            image_url: p.image_url,
            category_id: p.category?._id,
            category_name: p.category?.name,
            health_benefits: p.health_benefits,
            nutrition_info: p.nutrition_info,
            recommended_intake: p.recommended_intake,
            ai_context_notes: p.ai_context_notes,
            images: p.images
        })));
    } catch (error) {
        next(error);
    }
};

export const addProduct = async (req, res, next) => {
    try {
        // 1. Destructure incoming data from request body
        const { 
            category_id, 
            name, 
            description, 
            price, 
            stock_quantity, 
            weight,
            health_benefits, 
            nutrition_info, 
            recommended_intake, 
            ai_context_notes 
        } = req.body;
        
        // 2. Validate mandatory fields
        if (!category_id || !name || !price || stock_quantity === undefined) {
            return res.status(400).json({ 
                message: "Mandatory fields missing: category_id, name, price, and stock_quantity are required." 
            });
        }

        // Debug Log
        console.log('--- Add Product Debug ---');
        console.log('Files:', req.files);
        console.log('Body:', req.body);

        // 3. Handle Main Product Photo Upload (Simplified Logic)
        let image_url = '';
        if (req.files?.image?.length > 0) {
            image_url = `/uploads/products/${req.files.image[0].filename}`;
        }

        // 4. Handle Optional Additional Photos (Gallery)
        let images = [];
        if (req.files?.additional_images?.length > 0) {
            images = req.files.additional_images.map(file => `/uploads/products/${file.filename}`);
        }

        // 5. Save product to collection with exact field mapping
        const product = await Product.create({
            category: category_id,
            name: name.trim(),
            description: description || '',
            price: Number(price),
            stock_quantity: Number(stock_quantity),
            weight: weight || '',
            image_url: image_url, 
            images: images,
            health_benefits: health_benefits || '',
            nutrition_info: nutrition_info || '',
            recommended_intake: recommended_intake || '',
            ai_context_notes: ai_context_notes || ''
        });

        // 6. Synchronize Inventory
        await Inventory.create({
            product: product._id,
            available_stock: Number(stock_quantity),
            reserved_stock: 0
        });

        // 7. Send premium response
        res.status(201).json({ 
            success: true,
            message: 'Product listing created successfully', 
            product: {
                id: product._id,
                name: product.name,
                image_url: product.image_url
            }
        });

    } catch (error) {
        console.error('Add Product Error:', error);
        next(error);
    }
};

export const editProduct = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const { 
            category_id, name, description, price, stock_quantity, weight,
            health_benefits, nutrition_info, recommended_intake, ai_context_notes,
            additional_images // Existing images from frontend
        } = req.body;
        
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.category = category_id;
        product.name = name;
        product.description = description;
        product.price = price;
        product.stock_quantity = stock_quantity;
        product.weight = weight;
        product.health_benefits = health_benefits;
        product.nutrition_info = nutrition_info;
        product.recommended_intake = recommended_intake;
        product.ai_context_notes = ai_context_notes;

        // Debug Log
        console.log('--- Edit Product Debug ---');
        console.log('Files:', req.files);

        // Handle main image
        if (req.files?.image?.length > 0) {
            product.image_url = `/uploads/products/${req.files.image[0].filename}`;
        }

        // Handle additional images
        let updatedImages = [];
        if (additional_images) {
            updatedImages = Array.isArray(additional_images) ? additional_images : [additional_images];
        }

        if (req.files && req.files['additional_images']) {
            const newImages = req.files['additional_images'].map(file => `/uploads/products/${file.filename}`);
            updatedImages = [...updatedImages, ...newImages];
        }
        
        product.images = updatedImages;

        await product.save();

        // Update inventory available stock
        await Inventory.findOneAndUpdate(
            { product: productId },
            { available_stock: stock_quantity },
            { upsert: true }
        );

        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        next(error);
    }
};

export const removeProduct = async (req, res, next) => {
    try {
        const productId = req.params.id;
        await Product.findByIdAndDelete(productId);
        await Inventory.findOneAndDelete({ product: productId });
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        next(error);
    }
};

