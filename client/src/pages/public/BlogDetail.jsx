import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Heart, ThumbsUp, Calendar, User, Send } from 'lucide-react';
import api from '../../api/axios';

const BlogDetail = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    // Comment Form
    const [commentName, setCommentName] = useState('');
    const [commentContent, setCommentContent] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchBlog();
    }, [id]);

    const fetchBlog = async () => {
        try {
            const res = await api.get(`/blogs/${id}`);
            setBlog(res.data);
        } catch (err) {
            console.error('Failed to fetch blog', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post(`/blogs/${id}/comments`, {
                commenter_name: commentName,
                content: commentContent,
            });
            setCommentName('');
            setCommentContent('');
            fetchBlog(); // Refresh to show new comment
        } catch (err) {
            console.error(err);
            alert('Failed to post comment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleReaction = async (type) => {
        try {
            await api.post(`/blogs/${id}/reactions`, {
                commenter_name: 'Guest',
                reaction_type: type,
            });
            fetchBlog();
        } catch (err) {
            console.error('Failed to react', err);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-600"></div>
        </div>
    );

    if (!blog) return (
        <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900 text-gray-500">
            Blog not found
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-20">
            {/* Hero Section */}
            {blog.hero_image && (
                <div className="w-full h-[40vh] md:h-[60vh] relative mb-12">
                    <img src={blog.hero_image} alt={blog.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
                        <div className="max-w-4xl mx-auto">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg"
                            >
                                {blog.title}
                            </motion.h1>
                            <div className="flex items-center gap-6 text-white/80">
                                <span className="flex items-center gap-2"><User size={18} /> {blog.author_name || 'Admin'}</span>
                                <span className="flex items-center gap-2"><Calendar size={18} /> {new Date(blog.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Content if no hero image */}
                {!blog.hero_image && (
                    <div className="mb-12 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                            {blog.title}
                        </h1>
                        <div className="flex items-center justify-center gap-6 text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-2"><User size={18} /> {blog.author_name || 'Admin'}</span>
                            <span className="flex items-center gap-2"><Calendar size={18} /> {new Date(blog.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                )}

                {/* Blog Content */}
                <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 mb-12">
                    <div
                        className="prose prose-lg dark:prose-invert max-w-none ql-editor text-gray-900 dark:text-gray-100 [&_*]:text-gray-900 dark:[&_*]:text-gray-100"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />

                    {/* Reactions */}
                    <div className="flex gap-4 border-t border-gray-100 dark:border-gray-700 pt-8 mt-12">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleReaction('like')}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors font-medium"
                        >
                            <ThumbsUp size={20} />
                            <span>{blog.reactions?.find(r => r.reaction_type === 'like')?.count || 0} Likes</span>
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleReaction('love')}
                            className="flex items-center gap-2 px-6 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors font-medium"
                        >
                            <Heart size={20} />
                            <span>{blog.reactions?.find(r => r.reaction_type === 'love')?.count || 0} Love</span>
                        </motion.button>
                    </div>
                </article>

                {/* Comments Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
                    <h3 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white flex items-center gap-3">
                        <MessageSquare className="text-emerald-600" />
                        Comments ({blog.comments?.length || 0})
                    </h3>

                    {/* Comment Form */}
                    <form onSubmit={handleCommentSubmit} className="mb-12 bg-gray-50 dark:bg-gray-700/30 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                        <div className="grid grid-cols-1 gap-4 mb-4">
                            <input
                                type="text"
                                placeholder="Your Name"
                                className="w-full p-4 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                value={commentName}
                                onChange={(e) => setCommentName(e.target.value)}
                                required
                            />
                            <textarea
                                placeholder="Share your thoughts..."
                                className="w-full p-4 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white h-32 focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
                                value={commentContent}
                                onChange={(e) => setCommentContent(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {submitting ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Post Comment <Send size={18} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Comments List */}
                    <div className="space-y-8">
                        <AnimatePresence>
                            {blog.comments?.map((comment, index) => (
                                <motion.div
                                    key={comment.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex gap-4"
                                >
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                        {comment.commenter_name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-grow">
                                        <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-700">
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="font-bold text-gray-900 dark:text-white">{comment.commenter_name}</h4>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(comment.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{comment.content}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {blog.comments?.length === 0 && (
                            <p className="text-center text-gray-500 dark:text-gray-400 py-8 italic">
                                No comments yet. Be the first to share your thoughts!
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;
