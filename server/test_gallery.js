const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const testGallery = async () => {
    try {
        console.log('--- Testing Gallery Module ---');

        // 1. Login as Admin
        console.log('1. Logging in as Admin...');
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@fiftyvillagers.com',
            password: 'FifyAdmin@2025#Secure'
        });
        const token = loginRes.data.token;
        console.log('Login successful.');

        // 2. Create Section
        console.log('2. Creating Gallery Section...');
        const sectionRes = await axios.post('http://localhost:5000/api/gallery/sections', {
            name: 'Campus Life',
            description: 'Photos from our beautiful campus.'
        }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const sectionId = sectionRes.data.id;
        console.log('Section created with ID:', sectionId);

        // 3. Upload Image to Section
        console.log('3. Uploading Image to Section...');
        const filePath = path.join(__dirname, 'test_image.txt'); // Using dummy file for test
        fs.writeFileSync(filePath, 'dummy image content');

        // Create a fake jpg
        const jpgPath = path.join(__dirname, 'gallery_test.jpg');
        fs.writeFileSync(jpgPath, 'fake image content');

        const form = new FormData();
        form.append('section_id', sectionId);
        form.append('caption', 'Students studying in the library');
        form.append('image', fs.createReadStream(jpgPath));

        const uploadRes = await axios.post('http://localhost:5000/api/gallery/images', form, {
            headers: {
                ...form.getHeaders(),
                'Authorization': `Bearer ${token}`
            }
        });
        const imageId = uploadRes.data.id;
        console.log('Image uploaded with ID:', imageId);

        // 4. Get Gallery (Public)
        console.log('4. Fetching Gallery...');
        const galleryRes = await axios.get('http://localhost:5000/api/gallery');
        console.log('Sections found:', galleryRes.data.length);
        console.log('First Section Images:', galleryRes.data[0].images.length);

        // 5. Delete Image
        console.log('5. Deleting Image...');
        await axios.delete(`http://localhost:5000/api/gallery/images/${imageId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('Image deleted.');

        // 6. Delete Section
        console.log('6. Deleting Section...');
        await axios.delete(`http://localhost:5000/api/gallery/sections/${sectionId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('Section deleted.');

        // Cleanup
        fs.unlinkSync(filePath);
        fs.unlinkSync(jpgPath);

    } catch (err) {
        console.error('Test failed:', err.response ? err.response.data : err.message);
    }
};

testGallery();
