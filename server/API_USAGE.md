# API Usage Documentation

## Authentication
- **POST /api/auth/register**: Register a new student.
- **POST /api/auth/login**: Login for students and admins.
- **GET /api/auth/me**: Get current user details.

## Applications (Student)
- **POST /api/applications**: Create or update application.
- **GET /api/applications/my-application**: Get current student's application.

## Payment
- **POST /api/payment/create-order**: Create a Razorpay order.
  - Body: `{ amount: 500 }`
- **POST /api/payment/verify-payment**: Verify payment and auto-approve application.
  - Body: `{ razorpay_order_id, razorpay_payment_id, razorpay_signature, applicationId }`

## Admin
- **GET /api/admin/applications**: List all applications (with pagination).
- **PUT /api/admin/applications/:id/status**: Update application status manually.

## Public
- **GET /api/blogs**: List blogs.
- **GET /api/gallery**: List gallery images.
