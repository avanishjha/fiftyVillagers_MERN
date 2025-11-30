# API Testing Guide (Postman)

## Base URL
`http://localhost:5000`

## 1. Register a Student
*   **Method:** `POST`
*   **URL:** `http://localhost:5000/api/auth/register`
*   **Headers:** `Content-Type: application/json`
*   **Body (JSON):**
    ```json
    {
      "name": "John Doe",
      "email": "student@example.com",
      "password": "password123",
      "role": "student"
    }
    ```

## 2. Register an Admin
To create an admin, simply change the role to "admin".
*   **Method:** `POST`
*   **URL:** `http://localhost:5000/api/auth/register`
*   **Headers:** `Content-Type: application/json`
*   **Body (JSON):**
    ```json
    {
      "name": "Admin User",
      "email": "admin@example.com",
      "password": "adminpassword",
      "role": "admin"
    }
    ```

## 3. Login
*   **Method:** `POST`
*   **URL:** `http://localhost:5000/api/auth/login`
*   **Headers:** `Content-Type: application/json`
*   **Body (JSON):**
    ```json
    {
      "email": "admin@example.com",
      "password": "adminpassword"
    }
    ```
*   **Response:** You will receive a `token`. Copy this token.

## 4. Access Protected Routes
For routes that require login (like getting user profile):
*   **Method:** `GET`
*   **URL:** `http://localhost:5000/api/auth/me`
*   **Headers:**
    *   `Authorization`: `Bearer <PASTE_YOUR_TOKEN_HERE>`
