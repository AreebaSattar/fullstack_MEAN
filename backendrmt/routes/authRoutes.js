const express = require('express');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const { addUser, getUser, postUser, updateUser, deleteUser} = require("../controllers/userController");

// Generate JWT
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const router = express.Router();

// Register Route (Sign up)
router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;

    try {
        // Check if the user already exists
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create the new user
        const user = await User.create({
            username,
            password,
            role,
        });

        res.status(201).json({
            id: user._id,
            username: user.username,
            role: user.role,
            token: generateToken(user._id, user.role), // Generate JWT token for user
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate JWT token using the helper function
        const token = generateToken(user._id, user.role);

        // Respond with user data and the generated token
        res.json({
            id: user._id,
            username: user.username,
            role: user.role,
            token: token, // Return only the generated token
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});

// Admin-only route (only accessible by Admin users)
router.get('/admin-dashboard', authenticateToken, authorizeRole('Admin'), (req, res) => {
    res.json({ message: 'Welcome to the Admin Dashboard' });
});

// User-only route (only accessible by User users)
router.get('/user-dashboard', authenticateToken, authorizeRole('User'), (req, res) => {
    res.json({ message: 'Welcome to the User Dashboard' });
});

// User management routes (Admin only)
// router.get('/users', getUser); // Get all users (Admin only)
// router.post('/', postUser); // Add a new user (Admin only)
router.post('/', postUser);
router.get('/users', authenticateToken, authorizeRole('Admin'), getUser);
router.post('/users', authenticateToken, authorizeRole('Admin'), postUser);
router.put('/users/:id',authenticateToken, authorizeRole('Admin'), updateUser);
router.delete('/users/:id',authenticateToken,authorizeRole('Admin'),deleteUser);

module.exports = router;
