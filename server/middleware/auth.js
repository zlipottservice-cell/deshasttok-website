// Admin Authentication Middleware
const bcrypt = require('bcryptjs');

// Simple session store (in production, use Redis or similar)
const sessions = new Map();

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
    const sessionToken = req.headers['authorization']?.replace('Bearer ', '');

    if (!sessionToken || !sessions.has(sessionToken)) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    req.admin = sessions.get(sessionToken);
    next();
};

// Generate session token
const generateToken = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

module.exports = {
    requireAuth,
    generateToken,
    sessions,
    bcrypt
};
