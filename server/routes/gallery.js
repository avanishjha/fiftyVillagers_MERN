const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const admin = require('../middleware/admin');

// Public Routes
router.get('/', galleryController.getGallery);

// Admin Routes (Protected)
router.post('/sections', auth, admin, galleryController.createSection);
router.delete('/sections/:id', auth, admin, galleryController.deleteSection);
router.post('/images', auth, admin, upload.array('images', 10), galleryController.uploadImage);
router.delete('/images/:id', auth, admin, galleryController.deleteImage);

module.exports = router;
