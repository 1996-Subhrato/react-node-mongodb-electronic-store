import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Helper to create directory
const ensureDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// Storage configuration with dynamic destination
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Determine folder based on fieldname or route
        let dest = 'uploads/general';
        if (file.fieldname === 'category_image' || req.originalUrl.includes('categories')) {
            dest = 'uploads/categories';
        } else if (file.fieldname === 'product_image' || req.originalUrl.includes('products')) {
            dest = 'uploads/products';
        } else if (file.fieldname === 'profile_image' || req.originalUrl.includes('auth/profile')) {
            dest = 'uploads/profile_images';
        }
        
        ensureDir(dest);
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        let prefix = 'general';
        if (req.originalUrl.includes('categories')) prefix = 'category';
        else if (req.originalUrl.includes('products')) prefix = 'product';
        else if (req.originalUrl.includes('profile')) prefix = 'profile';
        cb(null, `${prefix}-${uniqueSuffix}${ext}`);
    }
});

// File filter (Images only)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only images (jpg, jpeg, png, webp, gif) are allowed!'), false);
    }
};

const uploadConfig = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
});

export const uploadCategory = uploadConfig;
export const uploadProduct = uploadConfig;
export const uploadProfile = uploadConfig;
