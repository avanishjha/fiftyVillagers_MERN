const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Student Routes
router.get('/my-application', auth, applicationController.getMyApplication);
router.post('/', auth, applicationController.saveApplication);

// Admin Routes
router.get('/', auth, admin, applicationController.getAllApplications);
router.put('/:id/status', auth, admin, applicationController.updateStatus);

module.exports = router;
