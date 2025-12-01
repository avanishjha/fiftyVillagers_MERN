const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

// Generic Upload Route (Protected)
// POST /api/upload
router.post('/', auth, upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }
        res.json({
            msg: 'File uploaded successfully',
            file: req.file,
            url: `http://localhost:5000/uploads/${req.file.filename}`
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
