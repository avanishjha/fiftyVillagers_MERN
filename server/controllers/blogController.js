const { pool } = require('../config/db');

// Get all blogs (Public)
// Get all blogs (Public)
exports.getAllBlogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const offset = (page - 1) * limit;

        const countResult = await pool.query('SELECT COUNT(*) FROM blogs');
        const total = parseInt(countResult.rows[0].count);

        const result = await pool.query(`
            SELECT b.*, u.name as author_name,
            (SELECT COUNT(*) FROM blog_comments WHERE blog_id = b.id) as comment_count,
            (SELECT COUNT(*) FROM blog_reactions WHERE blog_id = b.id) as reaction_count
            FROM blogs b
            LEFT JOIN users u ON b.author_id = u.id
            ORDER BY b.created_at DESC
            LIMIT $1 OFFSET $2
        `, [limit, offset]);

        res.json({
            data: result.rows,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get single blog by ID (Public)
exports.getBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await pool.query(`
            SELECT b.*, u.name as author_name 
            FROM blogs b
            LEFT JOIN users u ON b.author_id = u.id
            WHERE b.id = $1
        `, [id]);

        if (blog.rows.length === 0) {
            return res.status(404).json({ msg: 'Blog not found' });
        }

        // Get comments
        const comments = await pool.query(`
            SELECT * FROM blog_comments WHERE blog_id = $1 ORDER BY created_at DESC
        `, [id]);

        // Get reactions
        const reactions = await pool.query(`
            SELECT reaction_type, COUNT(*) as count 
            FROM blog_reactions 
            WHERE blog_id = $1 
            GROUP BY reaction_type
        `, [id]);

        res.json({
            ...blog.rows[0],
            comments: comments.rows,
            reactions: reactions.rows
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Create a blog (Admin only)
exports.createBlog = async (req, res) => {
    try {
        const { title, content, hero_image } = req.body;
        const newBlog = await pool.query(
            'INSERT INTO blogs (title, content, hero_image, author_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, content, hero_image, req.user.id]
        );
        res.json(newBlog.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update a blog (Admin only)
exports.updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, hero_image } = req.body;
        const updateBlog = await pool.query(
            'UPDATE blogs SET title = $1, content = $2, hero_image = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
            [title, content, hero_image, id]
        );

        if (updateBlog.rows.length === 0) {
            return res.status(404).json({ msg: 'Blog not found' });
        }

        res.json(updateBlog.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete a blog (Admin only)
exports.deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteBlog = await pool.query('DELETE FROM blogs WHERE id = $1 RETURNING *', [id]);

        if (deleteBlog.rows.length === 0) {
            return res.status(404).json({ msg: 'Blog not found' });
        }

        res.json({ msg: 'Blog deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Add a comment (Public)
exports.addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { commenter_name, content } = req.body;

        const newComment = await pool.query(
            'INSERT INTO blog_comments (blog_id, commenter_name, content) VALUES ($1, $2, $3) RETURNING *',
            [id, commenter_name, content]
        );

        res.json(newComment.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Add a reaction (Public)
exports.addReaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { commenter_name, reaction_type } = req.body;

        const newReaction = await pool.query(
            'INSERT INTO blog_reactions (blog_id, commenter_name, reaction_type) VALUES ($1, $2, $3) RETURNING *',
            [id, commenter_name, reaction_type]
        );

        res.json(newReaction.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
