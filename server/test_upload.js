const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

const testUpload = async () => {
    try {
        console.log('--- Testing File Upload ---');

        // 1. Login to get token
        console.log('1. Logging in...');
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@fiftyvillagers.com',
            password: 'FifyAdmin@2025#Secure'
        });
        const token = loginRes.data.token;
        console.log('Login successful.');

        // 2. Create a dummy file
        const filePath = path.join(__dirname, 'test_image.txt');
        fs.writeFileSync(filePath, 'This is a test file content.');

        // 3. Upload file
        console.log('2. Uploading file...');
        const form = new FormData();
        form.append('file', fs.createReadStream(filePath), {
            filename: 'test_image.txt',
            contentType: 'text/plain' // Multer filter might reject this if strict, but let's try or adjust filter
        });

        // Note: Our filter only accepts images/pdfs. Let's create a fake .jpg
        const jpgPath = path.join(__dirname, 'test_image.jpg');
        fs.writeFileSync(jpgPath, 'fake image content');

        const formJpg = new FormData();
        formJpg.append('file', fs.createReadStream(jpgPath));

        const uploadRes = await axios.post('http://localhost:5000/api/upload/test', formJpg, {
            headers: {
                ...formJpg.getHeaders(),
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('Upload successful!');
        console.log('File URL:', uploadRes.data.url);

        // Cleanup
        fs.unlinkSync(filePath);
        fs.unlinkSync(jpgPath);

    } catch (err) {
        console.error('Upload failed:', err.response ? err.response.data : err.message);
    }
};

testUpload();
