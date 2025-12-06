const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public Routes
router.get('/stories', studentController.getAllStories);
router.get('/stories/:id', studentController.getStoryById);

// Admin Routes (Protected)
router.post('/stories', auth, upload.single('image'), studentController.createStory);
router.put('/stories/:id', auth, upload.single('image'), studentController.updateStory);
router.delete('/stories/:id', auth, studentController.deleteStory);

module.exports = router;
