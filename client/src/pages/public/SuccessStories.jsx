import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, GraduationCap } from 'lucide-react';
import axios from 'axios';

const SuccessStories = () => {
    const [stories, setStories] = useState([]);
    const [selectedStory, setSelectedStory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/student/stories`);
            setStories(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch stories', err);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 font-display">
                            Success Stories
                        </h1>
                        <div className="space-y-4 text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-body">
                            <p>
                                At Fifty Villagers Seva Sansthan, we are inspired by the power of dreams and the unyielding spirit of our students. Our "Success Stories" showcase the resilience, dedication, and excellence of students who have overcome significant challenges to achieve success in the medical field and secure esteemed positions in government services.
                            </p>
                            <p>
                                These students come from environments where access to higher education is often limited, yet they have proven that with appropriate support and opportunities, success is not merely achievable but expected.
                            </p>
                            <p className="font-medium text-emerald-600 dark:text-emerald-400">
                                Each success story starts with our belief in their potential and our commitment to providing the necessary resources, guidance, and mentorship to turn their dreams into reality.
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                    </div>
                ) : (
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
