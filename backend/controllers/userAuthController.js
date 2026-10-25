import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config({ override: true });

const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret_key';

export const register = async (req, res, next) => {
    try {
        const { name, password, phone } = req.body;
        const email = req.body.email?.trim().toLowerCase();

        if (!email) {
            return res.status(400).json({ message: 'Email is required.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered.' });
        }

        const user = await User.create({ name, email, password, phone });

        res.status(201).json({ message: 'Registration successful!', userId: user._id });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { password } = req.body;
        const email = req.body.email?.trim().toLowerCase();

        if (!email) {
            return res.status(400).json({ message: 'Email is required.' });
        }

        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, name: user.name },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('user_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            message: 'Login successful!',
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email, 
                phone: user.phone, 
                profile_image: user.profile_image,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        next(error);
    }
};

export const updateProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { name, phone } = req.body;
        let updateData = { name, phone };
        
        if (req.file) {
            updateData.profile_image = `/uploads/profile_images/${req.file.filename}`;
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
        
        res.json({
            message: 'Profile updated successfully!',
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                profile_image: updatedUser.profile_image,
                createdAt: updatedUser.createdAt
            }
        });
    } catch (error) {
        next(error);
    }
};

export const changePassword = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect current password.' });
        }

        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password updated successfully!' });
    } catch (error) {
        next(error);
    }
};

export const logout = (req, res) => {
    res.clearCookie('user_token');
    res.json({ message: 'Logged out successfully.' });
};

export const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            profile_image: user.profile_image,
            createdAt: user.createdAt
        });
    } catch (error) {
        next(error);
    }
};

export const checkSession = async (req, res, next) => {
    try {
        const token = req.cookies.user_token;
        if (!token) return res.json(null);
        
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.json(null);

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            profile_image: user.profile_image,
            createdAt: user.createdAt
        });
    } catch (error) {
        res.json(null);
    }
};

