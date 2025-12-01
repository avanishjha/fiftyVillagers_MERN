const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const auth = require('../middleware/auth');

const admin = require('../middleware/admin');

// Public Routes
router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);
router.post('/:id/comments', blogController.addComment);
router.post('/:id/reactions', blogController.addReaction);

// Admin Routes (Protected)
router.post('/', auth, admin, blogController.createBlog);
router.put('/:id', auth, admin, blogController.updateBlog);
router.delete('/:id', auth, admin, blogController.deleteBlog);

module.exports = router;
