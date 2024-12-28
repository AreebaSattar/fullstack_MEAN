// fileUploadMiddleware.js
const multer = require('multer');
const path = require('path');

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    const fileTypes = /pdf|docx|png|jpg|jpeg/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extname && mimeType) {
        return cb(null, true);
    } else {
        cb('Invalid file type. Only PDF, DOCX, PNG, JPG are allowed.');
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Max size 5 MB
    fileFilter
});

module.exports = upload;
