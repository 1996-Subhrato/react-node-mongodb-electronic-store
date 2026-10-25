// TechZone — Reusable Code Snippets & Utility Helpers

import crypto from 'crypto';

/**
 * ============================================================================
 * FRONTEND HELPERS
 * ============================================================================
 */

/**
 * 1. Indian Price Formatter (INR)
 * Formats numbers into currency strings with Indian comma notation.
 * Example: formatPrice(134900) -> "₹1,34,900"
 */
export const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(price || 0);
};

/**
 * 2. Media Image URL Resolver
 * Seamlessly resolves local upload paths and external CDN URLs.
 */
export const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/placeholder.png';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    const backendBase = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${backendBase}${cleanPath}`;
};

/**
 * 3. Debounce Utility
 * Throttles high-frequency events (such as catalog search input keystrokes).
 */
export const debounce = (func, delay = 300) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
};

/**
 * 4. Human-Readable Date Formatter
 * Formats ISO timestamps into readable strings (e.g., "24 Oct 2026").
 */
export const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).format(new Date(dateString));
};

/**
 * 5. Input Scroll Wheel Protection
 * Blurs number input elements to prevent accidental mutations on wheel scroll.
 */
export const disableNumberInputScroll = (e) => {
    e.target.blur();
};

/**
 * ============================================================================
 * BACKEND HELPERS
 * ============================================================================
 */

/**
 * 6. Standardized Success Response Helper
 */
export const sendSuccess = (res, message, data = null, statusCode = 200) => {
    const payload = { success: true, message };
    if (data !== null) payload.data = data;
    return res.status(statusCode).json(payload);
};

/**
 * 7. Standardized Error Response Helper
 */
export const sendError = (res, message, statusCode = 400, error = null) => {
    const payload = { success: false, message };
    if (error && process.env.NODE_ENV === 'development') {
        payload.error = error.message || error;
    }
    return res.status(statusCode).json(payload);
};

/**
 * 8. Razorpay Payment Signature Verifier
 */
export const verifyRazorpaySignature = (orderId, paymentId, clientSignature, secret) => {
    const payload = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

    return expectedSignature === clientSignature;
};
