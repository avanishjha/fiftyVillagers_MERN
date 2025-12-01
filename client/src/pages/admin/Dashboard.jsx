import React from 'react';

const Dashboard = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Welcome, {user?.name}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded shadow">
                    <h3 className="text-xl font-semibold mb-2">Blogs</h3>
                    <p className="text-gray-600">Manage your blog posts and news.</p>
                </div>
                <div className="bg-white p-6 rounded shadow">
                    <h3 className="text-xl font-semibold mb-2">Gallery</h3>
                    <p className="text-gray-600">Upload and organize photos.</p>
                </div>
                <div className="bg-white p-6 rounded shadow">
                    <h3 className="text-xl font-semibold mb-2">Applications</h3>
                    <p className="text-gray-600">Review student applications (Coming Soon).</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
