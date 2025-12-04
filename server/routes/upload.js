const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');
const storage = require('../storage');

// Generic Upload Route (Protected)
// POST /api/upload
router.post('/', auth, upload.single('file'), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        // If using local driver, file is already on disk.
        // If we were using S3, we might upload here or use the storage adapter logic.
        // For now, we just construct the URL using the adapter pattern or direct logic.

        // Since our storage adapter 'uploadLocalFromFile' is designed to return the URL:
        const result = await storage.uploadLocalFromFile(req.file.path, req.file.filename);

        res.json({
            msg: 'File uploaded successfully',
            file: {
                filename: req.file.filename,
                mimetype: req.file.mimetype,
                size: req.file.size
            },
            url: result.url
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
