const { pool } = require('../config/db');
const storage = require('../storage');
const { logger } = require('../config/logger');

// Get all gallery sections with images (Public)
exports.getGallery = async (req, res) => {
    try {
        logger.info('Getting gallery', {
            userId: req.user?.id || 'public'
        });
        // Fetch sections
        const sections = await pool.query('SELECT * FROM gallery_sections ORDER BY id DESC');

        // Fetch images for each section
        const gallery = await Promise.all(sections.rows.map(async (section) => {
            const images = await pool.query(
                'SELECT * FROM gallery_images WHERE section_id = $1 ORDER BY uploaded_at DESC',
                [section.id]
            );
            return {
                ...section,
                images: images.rows
            };
        }));

        res.json(gallery);
    } catch (err) {
        logger.error('Failed to get gallery', {
            userId: req.user?.id || 'public',
            error: err.message
        });
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Create a new section (Admin)
exports.createSection = async (req, res) => {
    try {
        logger.info('Creating section', {
            userId: req.user.id,
            name: req.body.name,
            description: req.body.description
        });
        const { name, description } = req.body;
        const newSection = await pool.query(
            'INSERT INTO gallery_sections (name, description) VALUES ($1, $2) RETURNING *',
            [name, description]
        );
        res.json(newSection.rows[0]);
    } catch (err) {
        logger.error('Failed to create section', {
            userId: req.user?.id,
            name: req.body.name,
            description: req.body.description,
            error: err.message
        });
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete a section (Admin)
exports.deleteSection = async (req, res) => {
    try {
        logger.info('Deleting section', {
            userId: req.user.id,
            sectionId: req.params.id
        });
        const { id } = req.params;

        // Check if section exists
        const section = await pool.query('SELECT * FROM gallery_sections WHERE id = $1', [id]);
        if (section.rows.length === 0) {
            return res.status(404).json({ msg: 'Section not found' });
        }

        // Delete associated images from disk (optional, but good practice)
        // Delete associated images from storage
        const images = await pool.query('SELECT url FROM gallery_images WHERE section_id = $1', [id]);

        // Use Promise.all to delete files in parallel
        await Promise.all(images.rows.map(async (img) => {
            if (img.url) {
                const filename = img.url.split('/').pop();
                try {
                    logger.info('Deleting file', {
                        userId: req.user.id,
                        filename: filename
                    });
                    await storage.deleteFile(filename);
                } catch (e) {
                    logger.error('Failed to delete file', {
                        userId: req.user.id,
                        filename: filename,
                        error: e.message
                    });
                    console.error(`Failed to delete file ${filename}:`, e.message);
                }
            }
        }));

        // Delete section (Cascade will handle DB rows for images)
        await pool.query('DELETE FROM gallery_sections WHERE id = $1', [id]);

        res.json({ msg: 'Section deleted' });
    } catch (err) {
        logger.error('Failed to delete section', {
            userId: req.user?.id,
            sectionId: req.params.id,
            error: err.message
        });
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Upload image to section (Admin)
// Upload images to section (Admin)
exports.uploadImage = async (req, res) => {
    try {
        logger.info('Uploading image', {
            userId: req.user.id,
            sectionId: req.body.section_id,
            caption: req.body.caption
        });
        const { section_id, caption } = req.body;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ msg: 'No files uploaded' });
        }

        const uploadedImages = [];

        for (const file of req.files) {
            const url = storage.getFileUrl(file.filename);
            const newImage = await pool.query(
                'INSERT INTO gallery_images (section_id, url, caption) VALUES ($1, $2, $3) RETURNING *',
                [section_id, url, caption || ''] // Use same caption for all or empty
            );
            uploadedImages.push(newImage.rows[0]);
        }

        res.json(uploadedImages);
    } catch (err) {
        logger.error('Failed to upload image', {
            userId: req.user?.id,
            sectionId: req.body.section_id,
            caption: req.body.caption,
            error: err.message
        });
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete an image (Admin)
exports.deleteImage = async (req, res) => {
    try {
        logger.info('Deleting image', {
            userId: req.user.id,
            imageId: req.params.id
        });
        const { id } = req.params;

        // Get image URL to delete file
        const image = await pool.query('SELECT * FROM gallery_images WHERE id = $1', [id]);
        if (image.rows.length === 0) {
            return res.status(404).json({ msg: 'Image not found' });
        }

        const filename = image.rows[0].url.split('/').pop();
        await storage.deleteFile(filename);

        await pool.query('DELETE FROM gallery_images WHERE id = $1', [id]);

        res.json({ msg: 'Image deleted' });
    } catch (err) {
        logger.error('Failed to delete image', {
            userId: req.user?.id,
            imageId: req.params.id,
            error: err.message
        });
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
