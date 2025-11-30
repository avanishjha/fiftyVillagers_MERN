# Education Portal PRD & API Documentation

This Product Requirements Document outlines a web portal for managing entrance exams, built as a React single-page application (SPA) with a Node.js/Express backend and PostgreSQL database. The system serves two main user roles – Students and Admins – and includes features for application submission, verification, admit card and result management, a blog/news section, image galleries, and feedback via comments and reactions. All APIs are RESTful, with JSON payloads and JWT-based authentication/authorization.

## 1. Overview

*   **Objective:** Provide a seamless online workflow for students to register, apply for entrance exams, and receive admit cards and scores, while giving administrators tools to review applications, manage exams, and publish results.
*   **Stack:** React (SPA) frontend, Node.js + Express backend, PostgreSQL database.
*   **Key Themes:** Secure authentication (JWT), file uploads (e.g. photos, PDFs) via Multer + cloud storage (e.g. AWS S3 or Cloudinary), and PDF generation (PDFKit or Puppeteer) for admit cards/scorecards.

## 2. User Roles

*   **Student:** Can register/login, fill out application forms, upload required documents, check application status, download admit card, view and download results.
*   **Admin:** Can log into an admin dashboard to review/verify applications, request corrections, approve/reject, assign centers/roll numbers, bulk-generate admit cards, publish results, and manage content (blogs, galleries, feedback).
*   **Public/Guest:** May view published blogs, news, and public image galleries. They can also post comments or reactions on blog posts (by providing a name), but have no access to application or admin features.

## 3. Functional Modules

### 3.1 Student Portal

*   **Registration & Login:** Students sign up with basic info (name, email, password); login returns a JWT. (Use bcrypt for password hashing; JWT for auth[1].)
*   **Application Form:** Authenticated students can create or update an entrance exam application form containing fields like personal details, education background, exam category, etc.
*   **Document Upload:** Students upload a profile photo, signature image, and ID proof (PDF/image). Use Multer middleware to parse multipart/form-data, then upload files to cloud storage (AWS S3 or Cloudinary) to handle scaling and CDN delivery[2][3].
*   **Application Status:** Students can view the status of their application (e.g. Pending, Correction Requested, Approved, Rejected). Status is updated by admins.
*   **Admit Card Download:** Once an application is approved and exam center/roll is assigned, a downloadable PDF admit card is generated. This can be produced on-the-fly using an HTML template with Puppeteer (render React/HTML to PDF) or built with PDFKit from scratch[4][5].
*   **Result & Scorecard Download:** After exams, students see published results/scores. They can view summary results on-site and download a formatted scorecard PDF (similarly generated via PDFKit or Puppeteer).

### 3.2 Admin Portal

*   **Application Review:** Admins see a list of submitted applications. They can View Details, Verify Documents, and change application status. They can also request corrections by leaving comments on the application record. (A correction_requests table logs these.)
*   **Approve/Reject:** Admins mark applications as Approved or Rejected. This triggers notification to the student (email or portal alert).
*   **Assign Centers & Roll Numbers:** For approved applications, admins assign each student to an exam center and assign a unique roll number. (These may be fields on the application or stored in an admit_cards table.) This is often done in bulk via CSV upload or form.
*   **Admit Card Generation:** Admins can bulk-generate admit cards for many students. The system creates PDFs for each student (center, roll) and stores the PDF URL, or provides a combined ZIP. (Can use Puppeteer to render an HTML template for each admit card in batch.)
*   **Results Management:** Admins upload/publish exam results. This can be via CSV upload (which populates the results table) or manual entry through a form. Once uploaded, results are visible to students and scorecard PDFs can be generated.
*   **Blog/News Management:** Admins author and publish blog/news posts (title, content, categories, tags). They can edit or delete posts.
*   **Blog Feedback:** Admin dashboard shows all comments and reactions left by users on blog posts. Admins can moderate or remove inappropriate feedback.

### 3.3 Blog & News

*   **Posting:** Only admins can create/edit/delete blog or news posts. Each post has a title, body content (rich text), author (admin), timestamps, categories and tags.
*   **Browsing:** Blogs are publicly accessible. Visitors (logged in or not) can view posts, filter by category/tag, search, and react or comment.
*   **Categories/Tags:** Admins define categories (e.g. “Announcements”, “Tips”) and tags (free-form). Posts can belong to multiple categories/tags.
*   **Comments & Reactions:** Each blog post shows a section where users submit a name and either a textual comment or a predefined reaction (like 👍,❤️, etc). These are stored with a timestamp. Reactions can be just a single select (like vs love vs surprised), or a boolean “like”. Admins see all feedback. (Role-based JWT handling means users can be either identified by login or by provided name.)

### 3.4 Image Gallery

*   **Public Galleries:** A public gallery section (e.g. “Campus Events”, “Exams” categories) displays images in sections. Visitors can view and download images.
*   **Admin Uploads:** Admins can upload images, organize them into named sections or albums (via the gallery_sections table), add descriptions or dates. They can delete outdated images. File uploads use the same Multer+cloud pipeline.

### 3.5 Comments & Reactions System

*   **Submission:** On each blog/news page, an input form collects Name and Comment/Reaction. (If a logged-in user posts, their profile name can pre-fill; otherwise they enter a name.)
*   **Storage:** Comments and reactions are stored in separate tables (blog_comments, blog_reactions) linked to the blogs table. Fields include commenter name, content or reaction type, and timestamp.
*   **Admin View:** Admin dashboard shows a list of all comments and reactions (with links to the associated post). Admin can delete inappropriate entries.

## 4. Technical Architecture

*   **Frontend (React SPA):** A React single-page application handles all UI. It communicates with the backend via AJAX (e.g. Axios or Fetch) to JSON APIs. State management can use React Context or Redux. Protected views/routes check for JWT and user role. Because SEO is not critical for students content and it’s largely an authenticated app, SSR is optional. (For the public blog section, we could consider Next.js or prerendering to improve SEO[6], but a standard React SPA suffices for functionality.)
*   **Backend (Node.js + Express):** The server exposes REST API endpoints. Use Express Router to group routes (e.g. /auth, /students, /admin, /blogs, /gallery). Controllers/services handle business logic. Use environment-based config. Use the pg (node-postgres) library for DB queries[7].
*   **Authentication:** Stateless JWT tokens are issued at login. JWT is widely adopted for stateless auth as it “allows servers to verify requests without storing session data”[1]. Upon login (POST /auth/login), a JWT is signed (with a secure secret) that includes user ID and role. Middleware on protected routes checks Authorization: Bearer <token> in headers.
*   **Authorization:** Use role-based middleware. For example, routes under /admin/* require the JWT token with role: "admin" claim. JWT payload can carry a role claim, making “role-based authorization straightforward”[8].
*   **Database (PostgreSQL):** A relational schema stores all data. Use node-postgres (pg) client for queries[7]. Optionally use an ORM/Query builder (e.g. Sequelize, TypeORM, or knex) for model definitions. PostgreSQL is chosen for ACID compliance and SQL features. Run on a managed cloud DB or Docker (e.g. docker run postgres:14).
*   **File Storage:** For scalability, files (images, PDFs) should be stored on cloud. We use Multer to handle multipart uploads[3]. Uploaded files are then sent to cloud storage: AWS S3 or Cloudinary are recommended. (Cloudinary is designed for images; it provides automatic transformations/CDN, which is useful for the gallery[3]. AWS S3 is general-purpose, so could store PDFs too.) In either case, the backend saves only the file URL or public ID in the database.
*   **PDF Generation:** For admit cards and scorecards, generate PDFs server-side. Two approaches:
    *   **PDFKit:** Programmatically create a PDF from scratch (text, images) with PDFKit in Node.js[4]. Suitable for fixed templates.
    *   **Puppeteer:** Render an HTML/CSS template (built with React or Handlebars) headlessly using Puppeteer (headless Chrome) and output PDF[5]. Puppeteer can “generate screenshots and PDFs of pages”, which is useful if you already have a React page template for the card.
*   **Routes & Permissions:** Public (no auth) routes include: /auth/register, /auth/login, GET /blogs, GET /blogs/:id, GET /gallery, etc. Private (auth required) routes include all student and admin functions. Use Express middleware to protect private routes. E.g. app.use('/admin', authMiddleware('admin')).
*   **Security:** Store JWT secret in env, use HTTPS, sanitize inputs. Validate file types/sizes in Multer. Serve static assets (if any) through a CDN or web server. (CORS middleware for React-app domain.)
*   **Optional SSR Consideration:** If SEO for the public blog is important, use Next.js or server-side rendering for blog routes. Otherwise, treat entire app as SPA.

## 5. Data Model (PostgreSQL Schema)

*   **users:** (id PK, name, email UNIQUE, password_hash, role ENUM('student','admin'), created_at) – stores login credentials. (Alternatively separate students/admins, but a unified role field is simpler[7].)
*   **students (optional):** If extra student profile info needed (address, dob, etc) beyond users. Could merge into users.
*   **applications:** (id PK, student_id FK→users.id, submitted_at, status ENUM('pending','correction','approved','rejected'), correction_notes TEXT, photo_url, signature_url, id_proof_url, other form fields...). Contains the exam application data and attached document URLs.
*   **centers:** (id PK, name, location, capacity, exam_date). Pre-defined exam centers.
*   **admit_cards:** (id PK, application_id FK, center_id FK→centers.id, roll_number, pdf_url, generated_at). Once admin assigns center/roll, an admit card entry is created (pdf_url stored).
*   **results:** (id PK, application_id FK or student_id, exam_score, rank, passed BOOL, scorecard_url, published_at). Stores exam outcome per student.
*   **blogs:** (id PK, title, content TEXT, author_id FK→users.id, created_at, updated_at).
*   **categories:** (id PK, name UNIQUE). E.g. “News”, “Tips”, etc.
*   **blog_categories:** (blog_id FK, category_id FK). Many-to-many link table.
*   **tags:** (id PK, name UNIQUE).
*   **blog_tags:** (blog_id, tag_id). Many-to-many.
*   **blog_comments:** (id PK, blog_id FK, commenter_name, content TEXT, created_at).
*   **blog_reactions:** (id PK, blog_id FK, commenter_name, reaction_type VARCHAR, created_at). Reaction_type could be a string or enum (like/heart/etc).
*   **gallery_sections:** (id PK, name, description). E.g. “Campus Life”, “Exams”.
*   **gallery_images:** (id PK, section_id FK, url, caption, uploaded_at).
*   **correction_requests:** (id PK, application_id FK, admin_id FK, note TEXT, created_at). Logs when admin requests a correction.
*   **(Optional) feedback:** could combine comments and reactions, but we separate as above.

## 6. API Documentation

Below is a high-level summary of key API routes. Each route returns JSON. Authentication is via Bearer JWT in the Authorization header. Permission is listed as “Public”, “Student” (logged-in student), or “Admin”.

### 6.1 Authentication

*   **POST /api/auth/register**
    *   Description: Register new user (student).
    *   Request: JSON { "name": "...", "email": "...", "password": "..." }.
    *   Response: { "success": true, "userId": 123 } or error.
    *   Access: Public.
*   **POST /api/auth/login**
    *   Description: Login existing user.
    *   Request: { "email": "...", "password": "..." }.
    *   Response: { "token": "JWT_TOKEN", "role": "student" }.
    *   Access: Public.

### 6.2 Student Portal Endpoints

*   **GET /api/students/me**
    *   Description: Get logged-in student profile.
    *   Response: { "id": 123, "name": "...", "email": "...", ... }.
    *   Access: Student.
*   **POST /api/applications**
    *   Description: Submit or create application form.
    *   Request: JSON of application fields (e.g. "degree", "department", etc).
    *   Response: { "applicationId": 456 }.
    *   Access: Student.
*   **GET /api/applications/me**
    *   Description: Retrieve logged-in student’s application and its status.
    *   Response: { "id": 456, "status": "pending", "photo_url": "...", ... }.
    *   Access: Student.
*   **PUT /api/applications/me**
    *   Description: Update editable fields of application (before approval).
    *   Request: JSON of fields to update.
    *   Response: { "success": true }.
    *   Access: Student.
*   **POST /api/applications/me/upload**
    *   Description: Upload student’s photo/signature/ID proof. Uses multipart/form-data.
    *   Request: Files under fields photo, signature, id_proof.
    *   Response: { "photo_url": "...", "signature_url": "...", "id_proof_url": "..." }.
    *   Access: Student.
*   **GET /api/applications/me/admit-card**
    *   Description: Download admit card PDF.
    *   Response: PDF file or JSON with a downloadUrl.
    *   Access: Student (only if approved).
*   **GET /api/applications/me/result**
    *   Description: Get exam result and scorecard.
    *   Response: { "score": 85, "rank": 10, "scorecard_url": "..." }.
    *   Access: Student (only if results published).

### 6.3 Admin Portal Endpoints

*   **GET /api/admin/applications**
    *   Description: List all applications (with filters by status).
    *   Response: [ { "id":456, "student_name":"...", "status":"pending", ... }, ... ].
    *   Access: Admin.
*   **GET /api/admin/applications/:id**
    *   Description: Get detailed info for one application.
    *   Response: Full application data including submitted documents.
    *   Access: Admin.
*   **POST /api/admin/applications/:id/correct**
    *   Description: Request corrections on an application.
    *   Request: { "note": "Please upload a clearer photo." }.
    *   Response: { "success": true }.
    *   Access: Admin.
*   **PUT /api/admin/applications/:id/status**
    *   Description: Approve or reject an application.
    *   Request: { "status": "approved" } or {"status":"rejected"}.
    *   Response: { "success": true }.
    *   Access: Admin.
*   **PUT /api/admin/applications/:id/assign**
    *   Description: Assign center and roll number.
    *   Request: { "center_id": 5, "roll_number": 12345 }.
    *   Response: { "success": true }.
    *   Access: Admin.
*   **POST /api/admin/admit-cards/generate**
    *   Description: Bulk-generate admit cards for a list of application IDs.
    *   Request: { "application_ids": [456,457,458] }.
    *   Response: { "success": true, "cards": [ { "application_id":456, "pdf_url":"..." }, ... ] }.
    *   Access: Admin.
*   **POST /api/admin/results/upload**
    *   Description: Upload exam results via CSV.
    *   Request: Multipart/form-data with CSV file.
    *   Response: { "success": true, "imported": 100 }.
    *   Access: Admin.
*   **POST /api/admin/results**
    *   Description: Manually add or update a single result.
    *   Request: { "application_id":456, "score":85, "rank":10 }.
    *   Response: { "success": true }.
    *   Access: Admin.
*   **POST /api/admin/blogs**
    *   Description: Create a new blog post.
    *   Request: { "title":"...", "content":"...", "categories":[1,2], "tags":["exam","tips"] }.
    *   Response: { "blogId": 789 }.
    *   Access: Admin.
*   **PUT /api/admin/blogs/:id**
    *   Description: Edit an existing blog post.
    *   Request: Fields to update.
    *   Response: { "success": true }.
    *   Access: Admin.
*   **DELETE /api/admin/blogs/:id**
    *   Description: Delete a blog post.
    *   Response: { "success": true }.
    *   Access: Admin.
*   **GET /api/admin/feedback**
    *   Description: List all comments and reactions on blogs.
    *   Response: [ { "type":"comment", "blog_id":789, "name":"Alice","content":"Great post!" }, ... ].
    *   Access: Admin.
*   **GET/POST/DELETE /api/admin/gallery/sections and /api/admin/gallery/images**
    *   Description: Manage gallery sections and images.
    *   Access: Admin. (E.g. POST /gallery/sections to create section, POST /gallery/images with file upload for image.)

### 6.4 Blog & News (Public Endpoints)

*   **GET /api/blogs**
    *   Description: List all blog posts (with optional category/tag filters).
    *   Response: [ { "id":789, "title":"...", "excerpt":"...", "created_at":"...", "author":"Admin" }, ... ].
    *   Access: Public.
*   **GET /api/blogs/:id**
    *   Description: Get full blog post by ID.
    *   Response: { "id":789, "title":"...", "content":"...", "categories":["News"], "tags":["exam"], ... }.
    *   Access: Public.
*   **GET /api/categories, /api/tags**
    *   Description: List all categories and tags.
    *   Response: [{ "id":1, "name":"News" }, ...].
    *   Access: Public.
*   **POST /api/blogs/:id/comments**
    *   Description: Submit a comment on a blog post.
    *   Request: { "name":"Alice", "content":"Congrats to all!" }.
    *   Response: { "success": true, "commentId":123 }.
    *   Access: Public.
*   **POST /api/blogs/:id/reactions**
    *   Description: Submit a reaction on a blog post.
    *   Request: { "name":"Bob", "reaction":"👍" }.
    *   Response: { "success": true, "reactionId":456 }.
    *   Access: Public.
*   **GET /api/blogs/:id/comments and /api/blogs/:id/reactions**
    *   Description: Retrieve comments or reaction counts for a post.
    *   Response: Comments list or { "thumbs_up":10, "heart":3 }.
    *   Access: Public (for viewing only).

### 6.5 Image Gallery (Public)

*   **GET /api/gallery**
    *   Description: List all gallery sections and images.
    *   Response: [ { "section":"Campus Life", "images":[ { "url":"...", "caption":"..."}, ... ] }, ... ].
    *   Access: Public.
*   **GET /api/gallery/sections/:id/images**
    *   Description: Images in a specific section.
    *   Response: Similar to above.
    *   Access: Public.
*   (Admin endpoints for gallery creation/deletion are under /api/admin/... as noted above.)

## 7. Recommended Libraries & Technologies

*   **File Upload:** Use Multer (Express middleware) for handling multipart file uploads[3]. For storage, use AWS S3 (via AWS SDK) or Cloudinary. For example, Multer + Cloudinary provides “secure file uploads, storage, optimization, and delivery via a global CDN”[3] with benefits like automatic image resizing and CDN delivery[2].
*   **Authentication:** Use bcrypt for hashing passwords; use jsonwebtoken (JWT) for tokens. DigitalOcean notes JWTs are “common” and allow stateless auth[1], and role claims can be embedded for authorization[8].
*   **PDF Generation:** Consider PDFKit for programmatic PDF creation[4] and Puppeteer for rendering HTML/CSS to PDF[5]. PDFKit offers an API for text/images (but is not an HTML converter[9]), whereas Puppeteer can capture a web page as PDF with high fidelity[5].
*   **Database:** Use node-postgres (pg) library for PostgreSQL connectivity[7]. Use UUID or SERIAL primary keys. Use migrations (via Knex, Sequelize CLI, or plain SQL scripts).
*   **Frontend Libraries:** For React, consider React Router for SPA routing, Redux or Context for state, and Axios for API calls.
*   **Security/Misc:** Use helmet for HTTP headers, cors middleware. Use cloud storage SDKs (AWS SDK or Cloudinary SDK). Sanitize inputs (express-validator).

## 8. Public vs Private Routes

*   **Public routes:** /auth/register, /auth/login, all GET /blogs*, GET /gallery*, posting comments/reactions (guest name allowed), etc. No JWT required.
*   **Private Student routes:** Prefix /api/students and /api/applications/me, protected by JWT with role=student. Only the logged-in student can access their data (verify user ID matches).
*   **Private Admin routes:** Prefix /api/admin, protected by JWT with role=admin. Only admins can perform these actions.
*   **File Access:** Stored files (image/PDF URLs) on S3/Cloudinary should have appropriately limited access. If private, serve via signed URLs. If public (CDN), just store the URL. For example, admit card PDFs might be stored privately, with the API streaming them only to the authenticated student.

## 9. Server-Side Rendering (Optional)

React SPAs are generally client-rendered. If SEO for the blog is a priority, one could use Next.js or a hybrid: e.g. prerender only the blog pages, or use React Helmet for meta tags. (React alone “lacks built-in SSR and SEO features out of the box”[6]. Next.js “provides built-in server-side rendering, API routes, and performance optimizations”[10]. For this portal, SSR is optional since the main functionality is behind login, but it could be considered for blog/news.)

## 10. Summary

This document lays out the complete PRD and API design for the education portal. Each user role’s workflow is described, along with the required backend modules, database schema, and API endpoints. We recommend using proven libraries (Multer for uploads[3], JWT for auth[1][8], PDFKit/Puppeteer for PDFs[4][5]) and cloud storage for scalability. With React on the frontend and Express/PostgreSQL on the backend, this architecture will support a robust exam application system.

**Sources:** Industry best-practice guides and documentation on Node.js/Express, file uploads, JWT auth, PDF generation, and React SPA architecture[2][3][1][8][4][5][7][6]. These informed the recommendations for libraries and design.

---

*   [1] [8] [How To Use JSON Web Tokens (JWTs) in Express.js | DigitalOcean](https://www.digitalocean.com/community/tutorials/nodejs-jwt-expressjs)
*   [2] [3] [Node.js File Upload Guide: Multer, Cloudinary & Express](https://mantraideas.com/node-js-file-upload/)
*   [4] [9] [How to Generate PDF in Node.js Using PDFKit | PDFBolt](https://pdfbolt.com/blog/generate-pdf-pdfkit-nodejs)
*   [5] [Puppeteer HTML to PDF Generation with Node.js - RisingStack Engineering](https://blog.risingstack.com/pdf-from-html-node-js-puppeteer/)
*   [6] [10] [React vs Next.js in 2025: Which One Should You Choose?](https://www.theninjastudio.com/blog/next-js-vs-react)
*   [7] [How to Build a Node.js API with PostgreSQL and TypeScript: Best Practices and Tips | by Mateo Galic | Medium](https://medium.com/@mateogalic112/how-to-build-a-node-js-api-with-postgresql-and-typescript-best-practices-and-tips-84fee3d1c46c)
