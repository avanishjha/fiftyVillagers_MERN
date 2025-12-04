import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ThemeProvider } from '../context/ThemeContext';

const StudentLayout = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (!token || user.role !== 'student') {
            navigate('/student/login');
        }
    }, [token, user.role, navigate]);

    if (!token || user.role !== 'student') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    return (
        <ThemeProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-sans transition-colors duration-500">
                <Navbar />
                <div className="pt-24 pb-12">
                    <main>
                        <Outlet />
                    </main>
                </div>
                <Footer />
            </div>
        </ThemeProvider>
    );
};

export default StudentLayout;
