const axios = require('axios');

const testBlog = async () => {
    try {
        console.log('--- Testing Blog Module ---');

        // 1. Login as Admin
        console.log('1. Logging in as Admin...');
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@fiftyvillagers.com',
            password: 'FifyAdmin@2025#Secure'
        });
        const token = loginRes.data.token;
        console.log('Login successful.');

        // 2. Create Blog
        console.log('2. Creating Blog...');
        const createRes = await axios.post('http://localhost:5000/api/blogs', {
            title: 'Test Blog Post',
            content: 'This is the content of the test blog post.'
        }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const blogId = createRes.data.id;
        console.log('Blog created with ID:', blogId);

        // 3. Get All Blogs
        console.log('3. Fetching All Blogs...');
        const getAllRes = await axios.get('http://localhost:5000/api/blogs');
        console.log('Blogs found:', getAllRes.data.length);

        // 4. Add Comment (Public)
        console.log('4. Adding Comment...');
        await axios.post(`http://localhost:5000/api/blogs/${blogId}/comments`, {
            commenter_name: 'John Doe',
            content: 'Great post!'
        });
        console.log('Comment added.');

        // 5. Add Reaction (Public)
        console.log('5. Adding Reaction...');
        await axios.post(`http://localhost:5000/api/blogs/${blogId}/reactions`, {
            commenter_name: 'Jane Doe',
            reaction_type: 'like'
        });
        console.log('Reaction added.');

        // 6. Get Single Blog (Verify comments/reactions)
        console.log('6. Fetching Single Blog...');
        const getOneRes = await axios.get(`http://localhost:5000/api/blogs/${blogId}`);
        console.log('Blog Title:', getOneRes.data.title);
        console.log('Comments:', getOneRes.data.comments.length);
        console.log('Reactions:', getOneRes.data.reactions.length);

        // 7. Delete Blog
        console.log('7. Deleting Blog...');
        await axios.delete(`http://localhost:5000/api/blogs/${blogId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('Blog deleted.');

    } catch (err) {
        console.error('Test failed:', err.response ? err.response.data : err.message);
    }
};

testBlog();
