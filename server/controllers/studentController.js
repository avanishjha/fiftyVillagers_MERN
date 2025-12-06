const { pool } = require('../config/db');
const storage = require('../storage');

// Public: Get all success stories
exports.getAllStories = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM success_stories ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Public: Get single story
exports.getStoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM success_stories WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Story not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Admin: Create story
exports.createStory = async (req, res) => {
    try {
        const { name, batch, excerpt, content } = req.body;
        let image_url = null;

        if (req.file) {
            const uploadResult = await storage.uploadLocalFromFile(req.file.path, req.file.filename);
            image_url = uploadResult.url;
        }

        const newStory = await pool.query(
            'INSERT INTO success_stories (name, batch, image_url, excerpt, content) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, batch, image_url, excerpt, content]
        );

        res.json(newStory.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Admin: Update story
exports.updateStory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, batch, excerpt, content } = req.body;

        const story = await pool.query('SELECT * FROM success_stories WHERE id = $1', [id]);
        if (story.rows.length === 0) {
            return res.status(404).json({ msg: 'Story not found' });
        }

        let image_url = story.rows[0].image_url;

        if (req.file) {
            // Delete old image if exists
            if (image_url) {
                const oldFilename = image_url.split('/').pop();
                await storage.deleteFile(oldFilename);
            }
            const uploadResult = await storage.uploadLocalFromFile(req.file.path, req.file.filename);
            image_url = uploadResult.url;
        }

        const updatedStory = await pool.query(
            'UPDATE success_stories SET name = $1, batch = $2, image_url = $3, excerpt = $4, content = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
            [name, batch, image_url, excerpt, content, id]
        );

        res.json(updatedStory.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Admin: Delete story
exports.deleteStory = async (req, res) => {
    try {
        const { id } = req.params;
        const story = await pool.query('SELECT * FROM success_stories WHERE id = $1', [id]);

        if (story.rows.length === 0) {
            return res.status(404).json({ msg: 'Story not found' });
        }

        if (story.rows[0].image_url) {
            const filename = story.rows[0].image_url.split('/').pop();
            await storage.deleteFile(filename);
        }

        await pool.query('DELETE FROM success_stories WHERE id = $1', [id]);
        res.json({ msg: 'Story deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
