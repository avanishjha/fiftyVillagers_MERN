import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/admin/login');
        }
    }, [user, navigate]);

    if (!user || user.role !== 'admin') {
        return null;
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/admin/login');
    };

    const navItems = [
        { path: '/admin/dashboard', label: 'Dashboard' },
        { path: '/admin/blogs', label: 'Blogs' },
        { path: '/admin/gallery', label: 'Gallery' },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 text-white flex flex-col">
                <div className="p-4 text-xl font-bold border-b border-gray-700">
                    Admin Portal
                </div>
                <nav className="flex-1 p-4">
                    <ul>
                        {navItems.map((item) => (
                            <li key={item.path} className="mb-2">
                                <Link
                                    to={item.path}
                                    className={`block p-2 rounded ${location.pathname === item.path
                                            ? 'bg-blue-600'
                                            : 'hover:bg-gray-700'
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="p-4 border-t border-gray-700">
                    <button
                        onClick={handleLogout}
                        className="w-full text-left p-2 hover:bg-red-600 rounded transition"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="p-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
