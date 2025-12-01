import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';
import api from '../../api/axios';
import EmptyState from '../../components/EmptyState';

const Gallery = () => {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const res = await api.get('/gallery');
                setSections(res.data);
            } catch (err) {
                console.error('Failed to fetch gallery', err);
            } finally {
                setLoading(false);
            }
        };
        fetchGallery();
    }, []);

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
                        Our <span className="text-emerald-600 dark:text-emerald-400">Gallery</span>
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Capturing moments of joy, learning, and community at Fifty Villagers.
                    </p>
                </motion.div>

                {sections.length === 0 ? (
                    <EmptyState message="No photos available yet" />
                ) : (
                    sections.map((section) => (
                        <motion.div
                            key={section.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                            className="mb-20 last:mb-0"
                        >
                            <div className="mb-8 flex items-center gap-4">
                                <div className="h-10 w-2 bg-emerald-600 rounded-full"></div>
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{section.name}</h2>
                                    {section.description && <p className="text-gray-600 dark:text-gray-400 mt-1 text-lg">{section.description}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {section.images.map((img, imgIndex) => (
                                    <motion.div
                                        key={img.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: imgIndex * 0.05 }}
                                        className="group relative cursor-pointer overflow-hidden rounded-xl shadow-lg aspect-square bg-gray-200 dark:bg-gray-800"
                                        onClick={() => setSelectedImage(img)}
                                    >
                                        <img
                                            src={img.url}
                                            alt={img.caption}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                                            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                <ZoomIn className="text-white mb-2 opacity-80" size={24} />
                                                {img.caption && (
                                                    <p className="text-white font-medium text-sm line-clamp-2">
                                                        {img.caption}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-6xl w-full max-h-screen flex flex-col items-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors p-2"
                                onClick={() => setSelectedImage(null)}
                            >
                                <X size={32} />
                            </button>

                            <img
                                src={selectedImage.url}
                                alt={selectedImage.caption}
                                className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-2xl"
                            />

                            {selectedImage.caption && (
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="mt-6 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20"
                                >
                                    <p className="text-white text-center text-lg font-medium tracking-wide">{selectedImage.caption}</p>
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Gallery;
