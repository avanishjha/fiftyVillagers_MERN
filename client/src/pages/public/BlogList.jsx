import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MessageCircle, User, ArrowRight } from 'lucide-react';
import api from '../../api/axios';
import EmptyState from '../../components/EmptyState';
import Pagination from '../../components/Pagination';

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 9, totalPages: 1 });

    useEffect(() => {
        fetchBlogs(pagination.page);
    }, [pagination.page]);

    const fetchBlogs = async (page = 1) => {
        try {
            setLoading(true);
            const res = await api.get(`/blogs?page=${page}&limit=${pagination.limit}`);
            setBlogs(res.data.data);
            setPagination(prev => ({ ...prev, ...res.data.pagination }));
        } catch (err) {
            console.error('Failed to fetch blogs', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 font-sans tracking-tight">
                        Latest <span className="text-emerald-600 dark:text-emerald-400">Stories</span>
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Updates, news, and inspiring stories from Fifty Villagers.
                    </p>
                </motion.div>

                {blogs.length === 0 ? (
                    <EmptyState message="No stories published yet" />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map((blog, index) => (
                            <motion.article
                                key={blog.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100 dark:border-gray-700 group"
                            >
                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="flex items-center gap-4 text-xs font-medium text-gray-500 dark:text-gray-400 mb-4">
                                        <span className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full">
                                            <Calendar size={14} />
                                            {new Date(blog.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <User size={14} />
                                            {blog.author_name || 'Admin'}
                                        </span>
                                    </div>

                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                        <Link to={`/blogs/${blog.id}`}>
                                            {blog.title}
                                        </Link>
                                    </h2>

                                    <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3 flex-1 leading-relaxed">
                                        {blog.content}
                                    </p>

                                    <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-700 mt-auto">
                                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                                            <MessageCircle size={18} />
                                            <span>{blog.comment_count || 0} Comments</span>
                                        </div>
                                        <Link
                                            to={`/blogs/${blog.id}`}
                                            className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold hover:gap-3 transition-all"
                                        >
                                            Read Story <ArrowRight size={18} />
                                        </Link>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                )}
                <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
                />
            </div>
        </div>
    );
};

export default BlogList;
