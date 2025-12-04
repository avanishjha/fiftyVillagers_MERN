const Razorpay = require('razorpay');
const crypto = require('crypto');
const { pool } = require('../config/db');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_missing',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'missing_secret'
});

console.log("Razorpay Configured. Key ID:", process.env.RAZORPAY_KEY_ID ? process.env.RAZORPAY_KEY_ID.slice(0, 5) + "..." : "MISSING (Using Placeholder)");

// Create Order
exports.createOrder = async (req, res) => {
    try {
        console.log("createOrder called. Key ID:", process.env.RAZORPAY_KEY_ID ? "FOUND" : "MISSING");
        const { amount } = req.body; // Amount in smallest currency unit (paise)

        const options = {
            amount: amount * 100, // Convert to paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        res.json({
            ...order,
            key_id: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        console.error("Razorpay Order Error:", error);
        res.status(500).json({
            message: "Error creating order",
            error: error.error ? error.error.description : error.message
        });
    }
};

// Verify Payment
exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, applicationId } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // 1. Get Default Exam Center
            const centerRes = await pool.query('SELECT id FROM exam_centers LIMIT 1');
            let examCenterId = null;
            if (centerRes.rows.length > 0) {
                examCenterId = centerRes.rows[0].id;
            }

            // 2. Generate Roll Number
            const rollNumber = `FV-2025-${applicationId.toString().padStart(4, '0')}`;

            // 3. Update Application (Auto-Approve & Assign Center)
            await pool.query(
                `UPDATE applications 
                 SET payment_id = $1, 
                     order_id = $2, 
                     payment_status = 'paid', 
                     status = 'approved',
                     exam_center_id = $3,
                     roll_number = $4
                 WHERE id = $5`,
                [razorpay_payment_id, razorpay_order_id, examCenterId, rollNumber, applicationId]
            );

            res.json({ status: "success", message: "Payment verified and Admit Card generated" });
        } else {
            res.status(400).json({ status: "failure", message: "Invalid signature" });
        }
    } catch (error) {
        console.error("Payment Verification Error:", error);
        res.status(500).send("Error verifying payment");
    }
};
