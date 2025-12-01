import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Image as ImageIcon, Upload, X, FolderPlus } from 'lucide-react';
import api from '../../api/axios';
import EmptyState from '../../components/EmptyState';

const GalleryManager = () => {
    const [gallery, setGallery] = useState([]);
    const [loading, setLoading] = useState(true);

    // Section Form State
    const [newSectionName, setNewSectionName] = useState('');
    const [newSectionDesc, setNewSectionDesc] = useState('');

    // Image Upload State
    const [uploadSectionId, setUploadSectionId] = useState(null);
    const [uploadFiles, setUploadFiles] = useState([]);
    const [uploadCaption, setUploadCaption] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        try {
            const res = await api.get('/gallery');
            setGallery(res.data);
        } catch (err) {
            console.error('Failed to fetch gallery', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSection = async (e) => {
        e.preventDefault();
        try {
            await api.post('/gallery/sections', {
                name: newSectionName,
                description: newSectionDesc,
            });
            setNewSectionName('');
            setNewSectionDesc('');
            fetchGallery();
        } catch (err) {
            console.error(err);
            alert('Failed to create section');
        }
    };

    const handleDeleteSection = async (id) => {
        if (!window.confirm('Delete this section and all its images?')) return;
        try {
            await api.delete(`/gallery/sections/${id}`);
            fetchGallery();
        } catch (err) {
            console.error(err);
            alert('Failed to delete section');
        }
    };

    const handleUploadImage = async (e) => {
        e.preventDefault();
        if (uploadFiles.length === 0 || !uploadSectionId) return;

        const formData = new FormData();
        formData.append('section_id', uploadSectionId);
        Array.from(uploadFiles).forEach((file) => {
            formData.append('images', file);
        });
        formData.append('caption', uploadCaption);

        setUploading(true);
        try {
            await api.post('/gallery/images', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setUploadFiles([]);
            setUploadCaption('');
            setUploadSectionId(null);
            fetchGallery();
        } catch (err) {
            console.error(err);
            alert('Failed to upload images');
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteImage = async (id) => {
        if (!window.confirm('Delete this image?')) return;
        try {
            await api.delete(`/gallery/images/${id}`);
            fetchGallery();
        } catch (err) {
            console.error(err);
            alert('Failed to delete image');
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Gallery</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Organize your photos into sections</p>
                </div>
            </div>

            {/* Create Section Form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
            >
                <div className="flex items-center gap-2 mb-4 text-gray-900 dark:text-white">
                    <FolderPlus className="text-blue-600" />
                    <h2 className="text-xl font-semibold">Create New Section</h2>
                </div>
                <form onSubmit={handleCreateSection} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Section Name</label>
                        <input
                            type="text"
                            className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="e.g., Annual Sports Day"
                            value={newSectionName}
                            onChange={(e) => setNewSectionName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="md:col-span-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                        <input
                            type="text"
                            className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="Brief description of the event..."
                            value={newSectionDesc}
                            onChange={(e) => setNewSectionDesc(e.target.value)}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                        >
                            <Plus size={18} />
                            Create
                        </button>
                    </div>
                </form>
            </motion.div>

            {/* Gallery Sections List */}
            <div className="space-y-8">
                {gallery.length === 0 ? (
                    <EmptyState message="No gallery sections found" icon={ImageIcon} />
                ) : (
                    gallery.map((section, index) => (
                        <motion.div
                            key={section.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-start bg-gray-50/50 dark:bg-gray-900/50">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{section.name}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 mt-1">{section.description}</p>
                                </div>
                                <button
                                    onClick={() => handleDeleteSection(section.id)}
                                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                    title="Delete Section"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>

                            <div className="p-6">
                                {/* Images Grid */}
                                {section.images.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                                        <AnimatePresence>
                                            {section.images.map((img) => (
                                                <motion.div
                                                    key={img.id}
                                                    layout
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.5 }}
                                                    className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700"
                                                >
                                                    <img
                                                        src={img.url}
                                                        alt={img.caption}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <button
                                                            onClick={() => handleDeleteImage(img.id)}
                                                            className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-transform transform hover:scale-110"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                    {img.caption && (
                                                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
                                                            <p className="text-xs text-white truncate text-center">{img.caption}</p>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-900/30 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 mb-6">
                                        <ImageIcon className="mx-auto h-8 w-8 mb-2 opacity-50" />
                                        <p>No images in this section yet</p>
                                    </div>
                                )}

                                {/* Upload Area */}
                                {uploadSectionId === section.id ? (
                                    <motion.form
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        onSubmit={handleUploadImage}
                                        className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800"
                                    >
                                        <div className="flex flex-col md:flex-row gap-4 items-end">
                                            <div className="flex-1 w-full">
                                                <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">Select Images</label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                                                    onChange={(e) => setUploadFiles(e.target.files)}
                                                    required
                                                />
                                            </div>
                                            <div className="flex-1 w-full">
                                                <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">Caption (Optional)</label>
                                                <input
                                                    type="text"
                                                    placeholder="Shared caption for images..."
                                                    className="w-full p-2 border border-blue-200 dark:border-blue-700 rounded focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800 dark:text-white"
                                                    value={uploadCaption}
                                                    onChange={(e) => setUploadCaption(e.target.value)}
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    type="submit"
                                                    disabled={uploading}
                                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center gap-2"
                                                >
                                                    {uploading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <Upload size={18} />}
                                                    Upload
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setUploadSectionId(null)}
                                                    className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </motion.form>
                                ) : (
                                    <button
                                        onClick={() => setUploadSectionId(section.id)}
                                        className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all flex items-center justify-center gap-2 font-medium"
                                    >
                                        <Upload size={20} />
                                        Add Images to {section.name}
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default GalleryManager;
