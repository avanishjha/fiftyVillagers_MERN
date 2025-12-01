import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, FileText, Calendar, User } from 'lucide-react';
import api from '../../api/axios';
import EmptyState from '../../components/EmptyState';

const BlogManager = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const res = await api.get('/blogs');
            setBlogs(res.data);
        } catch (err) {
            console.error('Failed to fetch blogs', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this blog?')) return;
        try {
            await api.delete(`/blogs/${id}`);
            setBlogs(blogs.filter((blog) => blog.id !== id));
        } catch (err) {
            console.error(err);
            alert('Failed to delete blog');
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Blogs</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Create and manage your blog posts</p>
                </div>
                <Link
                    to="/admin/blogs/new"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    <Plus size={20} />
                    Create New Blog
                </Link>
            </div>

            {blogs.length === 0 ? (
                <EmptyState
                    message="No blogs found"
                    icon={FileText}
                    action={
                        <Link
                            to="/admin/blogs/new"
                            className="inline-flex items-center gap-2 text-blue-600 font-medium hover:underline"
                        >
                            Create your first post
                        </Link>
                    }
                />
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Author
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            <AnimatePresence>
                                {blogs.map((blog, index) => (
                                    <motion.tr
                                        key={blog.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                                                    <FileText size={20} />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{blog.title}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                <User size={16} className="mr-2" />
                                                {blog.author_name || 'Admin'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                <Calendar size={16} className="mr-2" />
                                                {new Date(blog.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-3">
                                                <Link
                                                    to={`/admin/blogs/edit/${blog.id}`}
                                                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-1 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded transition-colors"
                                                >
                                                    <Edit2 size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(blog.id)}
                                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default BlogManager;
