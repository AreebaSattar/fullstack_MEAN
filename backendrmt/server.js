const express = require('express');
const connectDB = require('./config/database');
const cors = require('cors');
const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');
const authRoutes = require('./routes/authRoutes');
const path = require('path');
const multer = require('multer');
const {authenticateToken, authorizeRole} = require("./middleware/authMiddleware");
const cookieSession = require("cookie-session");
require('dotenv').config(); // Load environment variables from .env

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(
    cookieSession({
        name: "areeba-session",
        keys: ["COOKIE_SECRET"], // should use as secret environment variable
        httpOnly: true
    })
);

// Middleware setup
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors({
    origin: 'http://localhost:4200', // Angular frontend running here
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use('/uploads', express.static('uploads')); // Serve uploaded files

// Connect to MongoDB
connectDB();

const fileSchema = new mongoose.Schema({
    filename: String,
    filepath: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    uploadedAt: { type: Date, default: Date.now }
});

const File = mongoose.model('File', fileSchema);

// Use routes user routjes with authorization
app.use('/api/auth', authRoutes);

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB file size limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|docx|png|pdf/;
        const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = allowedTypes.test(file.mimetype);
        if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            cb(null, true);
        } else if (extName && mimeType) {
            cb(null, true);
        } else {
            cb(new Error('Only images (jpg, png) and PDFs and DOCX are allowed.'));
        }
    }
}).single('File'); // 'File' should match the name attribute in Postman or frontend

app.post('/upload', authenticateToken, (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'Please send a file' });
        }
        try {
            const newFile = new File({
                filename: req.file.filename,
                filepath: req.file.path,
                uploadedBy: req.user.id
            });
            await newFile.save();

            res.status(200).json({
                message: 'File uploaded successfully!',
                file: {
                    id: newFile._id,
                    filename: newFile.filename,
                    filepath: newFile.filepath
                }
            });
        } catch (dbError) {
            console.error(dbError);
            res.status(500).json({ error: 'Error saving file metadata to the database' });
        }
    });
});
//This code is for fetching the files
//Users can fetch apni files
// or the files shared with them
app.get('/files', authenticateToken, async (req, res) => {
    try {
        let files;
        if (req.user.role === 'Admin') {
            // Admin can fetch all files
            files = await File.find();
        } else {
            // Regular users can only fetch their own files or those shared with them
            files = await File.find({
                $or: [
                    { uploadedBy: req.user.id },
                    { sharedWith: req.user.id }
                ]
            });
        }
        res.status(200).json(files);
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving files' });
    }
});
//sharing the file
//user can share his own file or Admin can share the file
//post
app.post('/files/share/:id', authenticateToken, authorizeRole('Admin', 'User'), async (req, res) => {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ error: 'File not found' });

    // Allow the file owner or Admin to share it
    if (file.uploadedBy.toString() !== req.user.id && req.user.role !== 'Admin') {
        return res.status(403).json({ error: 'You are not authorized to share this file.' });
    }

    file.sharedWith.push(req.body.userId); // Add user ID to the sharedWith array
    await file.save();
    res.status(200).json({ message: 'File shared successfully.' });
});
app.delete('/files/:id', authenticateToken, async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) return res.status(404).json({ error: 'File not found' });

        if (file.uploadedBy.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(403).json({ error: 'Access Forbidden' });
        }

        await file.delete();
        res.status(200).json({ message: 'File deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting the file' });
    }
});
app.get('/files/:id', authenticateToken, async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        // Check if the user is the owner or if the file is shared with them
        if (file.uploadedBy.toString() !== req.user.id && !file.sharedWith.includes(req.user.id) && req.user.role !== 'Admin') {
            return res.status(403).json({ error: 'Access denied. You are not authorized to download this file.' });
        }

        // If the user is authorized, send the file
        res.download(path.resolve(file.filepath)); // Sends the file to the client
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error retrieving the file' });
    }
});




// Load the JWT secret
const JWT_SECRET = process.env.JWT_SECRET;
console.log('Loaded Secret Key:', JWT_SECRET); // For debugging purposes only

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
