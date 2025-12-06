# API Usage Documentation

## Base URL
Development: `http://localhost:5000`
Production: `https://your-domain.com`

---

## 1. Authentication
*Rate Limit: 20 requests / 15 mins*

- **POST /api/auth/register**
  - Body: `{ name, email, password }`
  - Returns: `{ token, user }`
- **POST /api/auth/login**
  - Body: `{ email, password }`
  - Returns: `{ token, user }`
- **GET /api/auth/me**
  - Header: `Authorization: Bearer <token>`
  - Returns: User details.

## 2. Success Stories (Public & Admin)
- **GET /api/student/stories**
  - Query Params: `?page=1&limit=9`
  - Returns: `{ data: [stories], pagination: { total, page, limit, totalPages } }`
- **GET /api/student/stories/:id**: Get single story.
- **POST /api/student/stories** (Admin)
  - Headers: `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
  - Body: `{ name, batch, excerpt, content, image }`
- **PUT /api/student/stories/:id** (Admin)
  - Updates story. Supports image replacement.
- **DELETE /api/student/stories/:id** (Admin)

## 3. Applications (Student)
- **POST /api/applications**
  - Header: `Authorization: Bearer <token>`
  - Body: `{ father_name, dob, gender, address, ... }`
  - Creates or updates draft/submitted application.
- **GET /api/applications/my-application**
  - Returns: `{ status, student_name, roll_number, ... }` or 404.

## 4. Payment (Razorpay)
- **POST /api/payment/create-order**
  - Header: `Authorization: Bearer <token>`
  - Body: `{ amount: 500 }`
  - Returns: `{ id, currency, amount }` (Razorpay Order)
- **POST /api/payment/verify-payment**
  - Body: `{ razorpay_order_id, razorpay_payment_id, razorpay_signature, applicationId }`
  - Verifies signature and updates application status to `approved`.

## 5. Gallery
- **GET /api/gallery**: List all images.
- **POST /api/gallery** (Admin): Upload new image.
- **DELETE /api/gallery/:id** (Admin): Remove image.

## 6. Blogs
- **GET /api/blogs**
  - Query Params: `?page=1&limit=10`
- **GET /api/blogs/:id**: Get full blog post.
- **POST /api/blogs** (Admin): Create blog post.

## 7. Uploads
- **POST /api/upload**
  - Header: `Authorization: Bearer <token>`
  - Body: `FormData` with `file` field.
  - Returns: `{ url: "...", file: {...} }`
  - Supports: Images (jpg, png, webp) and PDFs. Max 5MB.
