const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authenticateToken = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Bearer token
    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        const user = await User.findById(decoded.id).select('-password'); // Find user

        if (!user) return res.status(404).json({ message: 'User not found.' }); // Check if user exists
        req.user = user; // Attach user to request
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired token.' }); // Handle invalid token
    }
};

// Middleware to check roles
const authorizeRole = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: `Access denied. Only ${roles.join(', ')} can perform this action.` });
    }
    next();
};

module.exports = { authenticateToken, authorizeRole };
