import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, GraduationCap } from 'lucide-react';
import axios from 'axios';

const SuccessStories = () => {
    const [stories, setStories] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [selectedStory, setSelectedStory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStories(1);
    }, []);

    const fetchStories = async (page = 1) => {
        try {
            setLoading(true);
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/student/stories?page=${page}&limit=9`);

            if (page === 1) {
                setStories(res.data.data);
            } else {
                setStories(prev => [...prev, ...res.data.data]);
            }
            setPagination(res.data.pagination);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch stories', err);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">
                            Our Consistently Growing Success Graph
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 font-body leading-relaxed">
                            Witness the journeys of resilience and triumph. From humble beginnings to prestigious positions, our students prove that dreams have no boundaries.
                        </p>
                    </motion.div>
                </div>

                {/* Grid */}
                {loading && stories.length === 0 ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {stories.map((story, index) => (
                                <motion.div
                                    key={story.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-700 group"
                                    onClick={() => setSelectedStory(story)}
                                >
                                    <div className="aspect-[4/5] overflow-hidden relative">
                                        <img
                                            src={story.image_url}
                                            alt={story.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />

                                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            <div className="text-emerald-400 font-bold mb-1 flex items-center gap-2">
                                                <GraduationCap size={18} /> {story.batch || 'Alumni'}
                                            </div>
                                            <h3 className="text-2xl font-bold mb-2 font-display">{story.name}</h3>
                                            <p className="text-gray-200 line-clamp-3 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                                {story.excerpt}
                                            </p>
                                            <div className="mt-4 flex items-center text-emerald-400 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                                                Read Full Story <ChevronRight size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {pagination && pagination.page < pagination.totalPages && (
                            <div className="mt-12 text-center">
                                <button
                                    onClick={() => fetchStories(pagination.page + 1)}
                                    disabled={loading}
                                    className="px-8 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0 border border-gray-200 dark:border-gray-700"
                                >
                                    {loading ? 'Loading...' : 'Load More Stories'}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modal / Detailed View */}
            <AnimatePresence>
                {selectedStory && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setSelectedStory(null)} // Close on background click
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-gray-900 w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                        >
                            <button
                                onClick={() => setSelectedStory(null)}
                                className="absolute top-4 right-4 z-10 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white md:text-gray-500 md:hover:text-gray-900 transition-colors"
                            >
                                <X size={24} />
                            </button>

                            {/* Left: Image */}
                            <div className="w-full md:w-5/12 h-64 md:h-auto relative">
                                <img
                                    src={selectedStory.image_url}
                                    alt={selectedStory.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
                                <div className="absolute bottom-4 left-4 text-white md:hidden">
                                    <h2 className="text-3xl font-bold">{selectedStory.name}</h2>
                                    <p className="text-emerald-300">{selectedStory.batch}</p>
                                </div>
                            </div>

                            {/* Right: Content */}
                            <div className="w-full md:w-7/12 p-8 md:p-12 overflow-y-auto">
                                <div className="hidden md:block mb-6">
                                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 font-display">{selectedStory.name}</h2>
                                    <span className="inline-block bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 px-4 py-1.5 rounded-full text-sm font-medium">
                                        Batch: {selectedStory.batch || 'N/A'}
                                    </span>
                                </div>

                                <div
                                    className="prose prose-emerald dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 font-body"
                                    dangerouslySetInnerHTML={{ __html: selectedStory.content }}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SuccessStories;
