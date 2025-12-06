import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Plus, Edit, Trash2, X, Save, Upload } from 'lucide-react';

const SuccessStoriesManager = () => {
    const [stories, setStories] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        name: '',
        batch: '',
        excerpt: '',
        content: '',
        image: null,
        existingImage: ''
    });

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } };

    const [pagination, setPagination] = useState(null);

    useEffect(() => {
        fetchStories(1);
    }, []);

    const fetchStories = async (page = 1) => {
        try {
            const res = await axios.get(`${API_URL}/api/student/stories?page=${page}&limit=12`, { headers: { Authorization: `Bearer ${token}` } });
            setStories(res.data.data);
            setPagination(res.data.pagination);
        } catch (err) {
            console.error('Failed to fetch stories');
        }
    };

    const handleEdit = (story) => {
        setFormData({
            id: story.id,
            name: story.name,
            batch: story.batch || '',
            excerpt: story.excerpt || '',
            content: story.content || '',
            image: null,
            existingImage: story.image_url
        });
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this story?')) return;
        try {
            await axios.delete(`${API_URL}/api/student/stories/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchStories();
        } catch (err) {
            alert('Failed to delete story');
        }
    };

    const resetForm = () => {
        setFormData({
            id: null,
            name: '',
            batch: '',
            excerpt: '',
            content: '',
            image: null,
            existingImage: ''
        });
        setIsEditing(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('batch', formData.batch);
        data.append('excerpt', formData.excerpt);
        data.append('content', formData.content);
        if (formData.image) data.append('image', formData.image);

        try {
            if (formData.id) {
                await axios.put(`${API_URL}/api/student/stories/${formData.id}`, data, config);
            } else {
                await axios.post(`${API_URL}/api/student/stories`, data, config);
            }
            fetchStories();
            resetForm();
        } catch (err) {
            console.error(err);
            alert('Failed to save story');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Manage Success Stories</h1>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <Plus size={20} /> Add New Story
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold dark:text-white">{formData.id ? 'Edit Story' : 'Create New Story'}</h2>
                        <button onClick={resetForm} className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-colors"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Batch (Year)</label>
                                <input
                                    type="text"
                                    value={formData.batch}
                                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-colors"
                                    placeholder="e.g. 2023-24"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Short Excerpt (Card Description)</label>
                            <textarea
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-colors h-24 resize-none"
                                maxLength={200}
                                placeholder="Brief intro shown on the card..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Story</label>
                            <div className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
                                <ReactQuill
                                    theme="snow"
                                    value={formData.content}
                                    onChange={(content) => setFormData({ ...formData, content })}
                                    className="h-64 mb-12"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Student Photo</label>
                            <div className="flex items-center gap-4">
                                {formData.existingImage && !formData.image && (
                                    <div className="relative group">
                                        <img
                                            src={formData.existingImage}
                                            alt="Current"
                                            className="w-32 h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center text-white text-xs">
                                            Current Image
                                        </div>
                                    </div>
                                )}
                                <label className="cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 px-6 py-4 rounded-xl flex flex-col items-center gap-2 text-gray-600 dark:text-gray-300 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-emerald-500 transition-colors w-full sm:w-auto">
                                    <Upload size={24} className="text-emerald-500" />
                                    <span className="font-medium">{formData.image ? 'Change Image' : 'Upload Image'}</span>
                                    {formData.image && <span className="text-xs text-emerald-600">{formData.image.name}</span>}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : <><Save size={20} /> Save Story</>}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stories.map((story) => (
                            <div key={story.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col">
                                <div className="h-48 overflow-hidden relative">
                                    <img src={story.image_url} alt={story.name} className="w-full h-full object-cover" />
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <button
                                            onClick={() => handleEdit(story)}
                                            className="p-2 bg-white/90 text-blue-600 rounded-full hover:bg-white"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(story.id)}
                                            className="p-2 bg-white/90 text-red-600 rounded-full hover:bg-white"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4 flex-1 flex flex-col">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{story.name}</h3>
                                    <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-2">{story.batch}</p>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4 flex-1">
                                        {story.excerpt}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {stories.length === 0 && (
                            <div className="col-span-full text-center py-12 text-gray-500">
                                No stories found. Add one to get started!
                            </div>
                        )}
                    </div>

                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex justify-center mt-8 gap-2">
                            <button
                                onClick={() => fetchStories(pagination.page - 1)}
                                disabled={pagination.page === 1}
                                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className="px-4 py-2 text-gray-600 dark:text-gray-300">
                                Page {pagination.page} of {pagination.totalPages}
                            </span>
                            <button
                                onClick={() => fetchStories(pagination.page + 1)}
                                disabled={pagination.page === pagination.totalPages}
                                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div >
    );
};

export default SuccessStoriesManager;
