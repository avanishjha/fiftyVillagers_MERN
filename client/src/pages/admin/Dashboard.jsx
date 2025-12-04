import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Image as ImageIcon, Users, ArrowRight, TrendingUp, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
    >
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${color} bg-opacity-10 dark:bg-opacity-20`}>
                <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
        </div>
        <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
            <TrendingUp size={16} className="mr-1" />
            <span className="font-medium">+12%</span>
            <span className="text-gray-400 ml-1">from last month</span>
        </div>
    </motion.div>
);

const QuickAction = ({ title, desc, link, icon: Icon, color }) => (
    <Link to={link} className="group">
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-full hover:shadow-md transition-all"
        >
            <div className={`w-12 h-12 rounded-xl ${color} bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">{title}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{desc}</p>
            <div className="flex items-center text-blue-600 font-medium text-sm">
                Go to {title} <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
        </motion.div>
    </Link>
);

const Dashboard = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [stats, setStats] = useState({ blogs: 0, gallery: 0, applications: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch real stats if endpoints exist, otherwise mock or count from list endpoints
                const [blogsRes, galleryRes] = await Promise.all([
                    api.get('/blogs'),
                    api.get('/gallery')
                ]);
                setStats({
                    blogs: blogsRes.data.length,
                    gallery: galleryRes.data.reduce((acc, sec) => acc + sec.images.length, 0),
                    applications: 12 // Mocked for now
                });
            } catch (err) {
                console.error("Failed to fetch stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, {user?.name}</p>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center gap-2">
                    <Activity size={16} className="text-green-500" />
                    System Status: <span className="font-semibold text-green-600">Healthy</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Blog Posts"
                    value={loading ? "..." : stats.blogs}
                    icon={FileText}
                    color="bg-blue-500"
                    delay={0.1}
                />
                <StatCard
                    title="Gallery Images"
                    value={loading ? "..." : stats.gallery}
                    icon={ImageIcon}
                    color="bg-purple-500"
                    delay={0.2}
                />
                <StatCard
                    title="Applications"
                    value={loading ? "..." : stats.applications}
                    icon={Users}
                    color="bg-emerald-500"
                    delay={0.3}
                />
            </div>

            {/* Quick Actions */}
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <QuickAction
                    title="Write New Story"
                    desc="Create a new blog post to share updates with the community."
                    link="/admin/blogs/new"
                    icon={FileText}
                    color="bg-blue-500"
                />
                <QuickAction
                    title="Upload Photos"
                    desc="Add new images to the gallery to showcase recent events."
                    link="/admin/gallery"
                    icon={ImageIcon}
                    color="bg-purple-500"
                />
                <QuickAction
                    title="Review Applications"
                    desc="Check pending student applications and approve admit cards."
                    link="/admin/applications"
                    icon={Users}
                    color="bg-emerald-500"
                />
            </div>
        </div>
    );
};

export default Dashboard;
