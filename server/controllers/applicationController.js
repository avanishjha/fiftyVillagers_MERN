const { pool } = require('../config/db');

// Get current student's application
exports.getMyApplication = async (req, res, next) => {
    try {
        const result = await pool.query(
            `SELECT a.*, ec.name as exam_center_name, ec.location as exam_center_location, ec.exam_date 
             FROM applications a
             LEFT JOIN exam_centers ec ON a.exam_center_id = ec.id
             WHERE a.student_id = $1`,
            [req.user.id]
        );
        if (result.rows.length === 0) {
            return res.json(null); // No application yet
        }
        res.json(result.rows[0]);
    } catch (err) {
        next(err);
    }
};

// Create or Update Application
// Create or Update Application
exports.saveApplication = async (req, res, next) => {
    try {
        const {
            father_name,
            father_occupation,
            family_members,
            dob,
            gender,
            address,
            pincode,
            phone,
            mobile_secondary,
            aadhar_number,
            school_name,
            photo_url,
            signature_url,
            id_proof_url,
            exam_category,
            special_condition,
            is_govt_school,
            status
        } = req.body;

        // Sanitize inputs (convert empty strings to null for integers/dates)
        const sanitizedFamilyMembers = family_members === '' ? null : family_members;
        const sanitizedDob = dob === '' ? null : dob;

        // Check if application exists
        const check = await pool.query(
            'SELECT id FROM applications WHERE student_id = $1',
            [req.user.id]
        );

        if (check.rows.length > 0) {
            // Update
            const updateQuery = `
                UPDATE applications 
                SET father_name = $1, father_occupation = $2, family_members = $3, dob = $4, gender = $5, 
                    address = $6, pincode = $7, phone = $8, mobile_secondary = $9, aadhar_number = $10,
                    school_name = $11, photo_url = $12, signature_url = $13, 
                    id_proof_url = $14, exam_category = $15, special_condition = $16, is_govt_school = $17,
                    status = COALESCE($18, status)
                WHERE student_id = $19
                RETURNING *
            `;
            const updated = await pool.query(updateQuery, [
                father_name, father_occupation, sanitizedFamilyMembers, sanitizedDob, gender,
                address, pincode, phone, mobile_secondary, aadhar_number,
                school_name, photo_url, signature_url,
                id_proof_url, exam_category, special_condition, is_govt_school,
                status || null, // Use null for COALESCE to work if status is undefined
                req.user.id
            ]);
            return res.json(updated.rows[0]);
        } else {
            // Create
            const insertQuery = `
                INSERT INTO applications (
                    student_id, father_name, father_occupation, family_members, dob, gender, 
                    address, pincode, phone, mobile_secondary, aadhar_number, school_name, 
                    photo_url, signature_url, id_proof_url, exam_category, 
                    special_condition, is_govt_school, status
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
                RETURNING *
            `;
            const newApp = await pool.query(insertQuery, [
                req.user.id, father_name, father_occupation, sanitizedFamilyMembers, sanitizedDob, gender,
                address, pincode, phone, mobile_secondary, aadhar_number, school_name,
                photo_url, signature_url, id_proof_url, exam_category,
                special_condition, is_govt_school, status || 'pending'
            ]);
            return res.json(newApp.rows[0]);
        }
    } catch (err) {
        console.error("Error in saveApplication:", err);
        console.error("Request Body:", req.body);
        console.error("User:", req.user);
        next(err);
    }
};

// Admin: Get all applications
// Admin: Get all applications
exports.getAllApplications = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const countResult = await pool.query('SELECT COUNT(*) FROM applications');
        const total = parseInt(countResult.rows[0].count);

        const result = await pool.query(`
            SELECT a.*, u.name as student_name, u.email as student_email 
            FROM applications a
            JOIN users u ON a.student_id = u.id
            ORDER BY a.submitted_at DESC
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
        next(err);
    }
};

// Admin: Update application status
exports.updateStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, correction_notes } = req.body;

        const result = await pool.query(
            'UPDATE applications SET status = $1, correction_notes = $2 WHERE id = $3 RETURNING *',
            [status, correction_notes, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Application not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        next(err);
    }
};
