const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.post('/generate-admit-card', auth, admin, examController.generateAdmitCard);
router.get('/my-admit-card', auth, examController.getAdmitCard);

module.exports = router;
