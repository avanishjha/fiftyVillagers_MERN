const axios = require('axios');

const testRBAC = async () => {
    try {
        console.log('--- Testing RBAC (Student Access) ---');

        // 1. Register a new student (or login if exists)
        const studentEmail = `student_${Date.now()}@test.com`;
        const studentPassword = 'password123';

        console.log('1. Registering/Logging in as Student...');
        let token;
        try {
            const regRes = await axios.post('http://localhost:5000/api/auth/register', {
                name: 'Test Student',
                email: studentEmail,
                password: studentPassword
            });
            token = regRes.data.token;
            console.log('Student registered successfully.');
        } catch (err) {
            // If already exists, login
            const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
                email: studentEmail,
                password: studentPassword
            });
            token = loginRes.data.token;
            console.log('Student logged in successfully.');
        }

        // 2. Attempt to Create Blog (Should Fail)
        console.log('2. Attempting to Create Blog (Expect 403)...');
        try {
            await axios.post('http://localhost:5000/api/blogs', {
                title: 'Hacked Blog',
                content: 'I should not be able to post this.'
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.error('FAIL: Student was able to create a blog!');
        } catch (err) {
            if (err.response && err.response.status === 403) {
                console.log('SUCCESS: Blog creation blocked (403 Forbidden).');
            } else {
                console.error('FAIL: Unexpected error:', err.message);
            }
        }

        // 3. Attempt to Create Gallery Section (Should Fail)
        console.log('3. Attempting to Create Gallery Section (Expect 403)...');
        try {
            await axios.post('http://localhost:5000/api/gallery/sections', {
                name: 'Hacked Section',
                description: 'I should not be able to create this.'
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.error('FAIL: Student was able to create a gallery section!');
        } catch (err) {
            if (err.response && err.response.status === 403) {
                console.log('SUCCESS: Gallery section creation blocked (403 Forbidden).');
            } else {
                console.error('FAIL: Unexpected error:', err.message);
            }
        }

    } catch (err) {
        console.error('Test failed:', err.message);
    }
};

testRBAC();
