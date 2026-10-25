import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import dotenv from 'dotenv';

dotenv.config({ override: true });

const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret_key';

export const login = async (req, res, next) => {
    try {
        const { password } = req.body;
        const email = req.body.email?.trim().toLowerCase();

        if (!email) {
            return res.status(400).json({ message: 'Email is required.' });
        }

        const admin = await Admin.findOne({ email });
        if (!admin || !(await admin.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid admin credentials.' });
        }

        const token = jwt.sign(
            { id: admin._id, email: admin.email, name: admin.name, isAdmin: true },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.cookie('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.json({
            message: 'Admin login successful!',
            admin: { id: admin._id, name: admin.name, email: admin.email }
        });
    } catch (error) {
        next(error);
    }
};

export const logout = (req, res) => {
    res.clearCookie('admin_token');
    res.json({ message: 'Admin logged out successfully.' });
};

export const getDashboardInfo = (req, res) => {
    res.json({ message: 'Welcome to the protected Admin Dashboard', stats: { orders: 0, customers: 0 } });
};

export const checkSession = async (req, res, next) => {
    try {
        const token = req.cookies.admin_token;
        if (!token) return res.json(null);
        
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded.isAdmin) return res.json(null);
        
        const admin = await Admin.findById(decoded.id);
        if (admin) {
             res.json({ id: admin._id, name: admin.name, email: admin.email, isAdmin: true });
        } else {
             res.json(null);
        }
    } catch (error) {
        res.json(null);
    }
};

