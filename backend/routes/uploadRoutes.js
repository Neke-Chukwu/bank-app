import express from 'express';
import multer from 'multer';
import { authenticate } from '../middlewares/authMiddleware.js';
import { uploadProfilePicture } from '../controllers/uploadController.js';

// Configure multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(null, false);
            req.fileValidationError = new Error('Only JPEG, PNG, and GIF images are allowed.');
        }
    },
}).single('profilePicture');

const router = express.Router();

// Middleware to handle file validation errors
const handleFileValidationError = (req, res, next) => {
    if (req.fileValidationError) {
        return res.status(400).json({ message: req.fileValidationError.message });
    }
    next();
};

// Route to handle profile picture upload
router.post(
    '/upload',
    authenticate,
    upload,
    handleFileValidationError,
    uploadProfilePicture
);

export default router;