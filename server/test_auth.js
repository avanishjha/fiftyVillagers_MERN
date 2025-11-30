const http = require('http');

const postRequest = (path, data) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length,
            },
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => (body += chunk));
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, body: JSON.parse(body) });
                } catch (e) {
                    resolve({ status: res.statusCode, body: body });
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(data);
        req.end();
    });
};

const testAuth = async () => {
    console.log('--- Testing Authentication ---');

    // 1. Register
    const registerData = JSON.stringify({
        name: 'Test Student',
        email: 'test@example.com',
        password: 'password123',
        role: 'student'
    });

    console.log('\n1. Registering User...');
    try {
        const regRes = await postRequest('/api/auth/register', registerData);
        console.log('Status:', regRes.status);
        console.log('Body:', regRes.body);

        if (regRes.status !== 200 && regRes.body.msg !== 'User already exists') {
            console.error('Registration failed');
            return;
        }
    } catch (err) {
        console.error('Registration error:', err);
    }

    // 2. Login
    const loginData = JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
    });

    console.log('\n2. Logging In...');
    try {
        const loginRes = await postRequest('/api/auth/login', loginData);
        console.log('Status:', loginRes.status);
        console.log('Body:', loginRes.body);

        if (loginRes.body.token) {
            console.log('\nSUCCESS: Got JWT Token!');
        } else {
            console.log('\nFAILURE: No token received.');
        }
    } catch (err) {
        console.error('Login error:', err);
    }
};

// Wait a bit for server to start then run
setTimeout(testAuth, 3000);
