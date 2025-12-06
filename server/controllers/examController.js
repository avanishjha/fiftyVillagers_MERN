const { pool } = require('../config/db');
const { logger } = require('../config/logger');

// Generate Admit Card (Auto-assign default center)
exports.generateAdmitCard = async (req, res) => {
    try {
        logger.info('Generating admit card', {
            userId: req.user.id,
            applicationId: req.body.applicationId
        });
        const { applicationId } = req.body;

        // Get default center
        const centerRes = await pool.query('SELECT * FROM exam_centers LIMIT 1');
        if (centerRes.rows.length === 0) {
            return res.status(500).json({ message: "No exam center found" });
        }
        const center = centerRes.rows[0];

        // Generate Roll Number (e.g., FV-2025-0001)
        const rollNumber = `FV-2025-${applicationId.toString().padStart(4, '0')}`;

        // Update Application
        const updateQuery = `
            UPDATE applications 
            SET exam_center_id = $1, roll_number = $2, status = 'approved'
            WHERE id = $3
            RETURNING *
        `;
        const updated = await pool.query(updateQuery, [center.id, rollNumber, applicationId]);

        res.json({ message: "Admit Card Generated", data: updated.rows[0] });
    } catch (err) {
        logger.error('Failed to generate admit card', {
            userId: req.user.id,
            applicationId: req.body.applicationId,
            error: err.message
        });
        console.error(err);
        res.status(500).send("Server Error");
    }
};

// Get Admit Card for Student
exports.getAdmitCard = async (req, res) => {
    try {
        logger.info('Getting admit card', {
            userId: req.user.id
        });
        const studentId = req.user.id;

        const query = `
            SELECT a.roll_number, a.student_id, u.name, u.email, a.photo_url, 
                   c.name as center_name, c.location as center_location, c.exam_date
            FROM applications a
            JOIN users u ON a.student_id = u.id
            LEFT JOIN exam_centers c ON a.exam_center_id = c.id
            WHERE a.student_id = $1 AND a.roll_number IS NOT NULL
        `;

        const result = await pool.query(query, [studentId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Admit Card not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        logger.error('Failed to get admit card', {
            userId: req.user.id,
            error: err.message
        });
        console.error(err);
        res.status(500).send("Server Error");
    }
};
