import Category from '../models/Category.js';
import Product from '../models/Product.js';

export const getAdminCategories = async (req, res) => {
    try {
        const categories = await Category.aggregate([
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: 'category',
                    as: 'products'
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    image_url: 1,
                    product_count: { $size: '$products' }
                }
            }
        ]);

        res.json(categories.map(c => ({
            id: c._id,
            name: c.name,
            description: c.description,
            image_url: c.image_url,
            product_count: c.product_count
        })));
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Failed to fetch categories' });
    }
};


export const createAdminCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        let image_url = null;

        if (req.file) {
            image_url = `/uploads/categories/${req.file.filename}`;
        }

        if (!name) {
            return res.status(400).json({ message: 'Category name is required' });
        }

        const category = await Category.create({ name, description, image_url });
        
        res.status(201).json({ 
            message: 'Category created successfully', 
            category: {
                id: category._id,
                name: category.name,
                description: category.description,
                image_url: category.image_url
            }
        });
    } catch (error) {
        console.error('Error creating category:', error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'A category with this name already exists' });
        }
        res.status(500).json({ message: 'Failed to create category' });
    }
};

export const updateAdminCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const { name, description } = req.body;
        
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        if (req.file) {
            category.image_url = `/uploads/categories/${req.file.filename}`;
        }

        if (name) category.name = name;
        if (description !== undefined) category.description = description;

        await category.save();

        res.json({ 
            message: 'Category updated successfully', 
            category: {
                id: category._id,
                name: category.name,
                description: category.description,
                image_url: category.image_url
            }
        });
    } catch (error) {
        console.error('Error updating category:', error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'A category with this name already exists' });
        }
        res.status(500).json({ message: 'Failed to update category' });
    }
};

export const deleteAdminCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;

        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Feature Rule: Do not delete if products are attached.
        const productCount = await Product.countDocuments({ category: categoryId });
        if (productCount > 0) {
            return res.status(400).json({ 
                message: `Cannot delete category: Please re-assign or delete the ${productCount} existing product(s) first.` 
            });
        }

        await Category.findByIdAndDelete(categoryId);
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'Failed to delete category' });
    }
};

