import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Eye, Edit3, Layout, Type, Image as ImageIcon, Upload } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../../api/axios';

const BlogEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;
    const quillRef = useRef(null);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        hero_image: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('write'); // 'write' or 'preview'
    const [uploadingHero, setUploadingHero] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            fetchBlog();
        }
    }, [id]);

    const fetchBlog = async () => {
        try {
            const res = await api.get(`/blogs/${id}`);
            setFormData({
                title: res.data.title,
                content: res.data.content,
                hero_image: res.data.hero_image || '',
            });
        } catch (err) {
            setError('Failed to fetch blog details');
        }
    };

    const handleHeroUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingHero(true);
        const data = new FormData();
        data.append('file', file);

        try {
            const res = await api.post('/upload', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData(prev => ({ ...prev, hero_image: res.data.url }));
        } catch (err) {
            setError('Failed to upload hero image');
        } finally {
            setUploadingHero(false);
        }
    };

    // Custom Image Handler for Quill
    const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (!file) return;

            const data = new FormData();
            data.append('file', file);

            try {
                const res = await api.post('/upload', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                const url = res.data.url;
                const quill = quillRef.current.getEditor();
                const range = quill.getSelection();
                quill.insertEmbed(range.index, 'image', url);
            } catch (err) {
                console.error('Image upload failed', err);
                setError('Failed to upload inline image');
            }
        };
    };

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['link', 'image'],
                ['clean']
            ],
            handlers: {
                image: imageHandler
            }
        }
    }), []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isEditMode) {
                await api.put(`/blogs/${id}`, formData);
            } else {
                await api.post('/blogs', formData);
            }
            navigate('/admin/blogs');
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to save blog');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/admin/blogs')}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-600 dark:text-gray-300"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                            {isEditMode ? 'Edit Story' : 'New Story'}
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-1 flex">
                            <button
                                onClick={() => setActiveTab('write')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'write'
                                        ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                    }`}
                            >
                                <Edit3 size={16} /> Write
                            </button>
                            <button
                                onClick={() => setActiveTab('preview')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'preview'
                                        ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                    }`}
                            >
                                <Eye size={16} /> Preview
                            </button>
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !formData.title || !formData.content}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Save size={18} /> Publish
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-lg mb-6 flex items-center gap-2"
                    >
                        <span className="w-2 h-2 bg-red-500 rounded-full" />
                        {error}
                    </motion.div>
                )}

                {activeTab === 'write' ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden min-h-[calc(100vh-12rem)]"
                    >
                        <div className="p-8 md:p-12">
                            {/* Hero Image Upload */}
                            <div className="mb-8 group">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2 group-focus-within:text-blue-500 transition-colors">
                                    <ImageIcon size={16} /> Cover Image
                                </label>
                                <div className="relative w-full h-48 md:h-64 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors flex flex-col items-center justify-center cursor-pointer group-hover:bg-gray-50 dark:group-hover:bg-gray-700/80">
                                    {formData.hero_image ? (
                                        <>
                                            <img src={formData.hero_image} alt="Hero" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <p className="text-white font-medium flex items-center gap-2"><Upload size={20} /> Change Cover</p>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center p-6">
                                            <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Click to upload cover image</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleHeroUpload}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    {uploadingHero && (
                                        <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mb-8 group">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2 group-focus-within:text-blue-500 transition-colors">
                                    <Type size={16} /> Title
                                </label>
                                <input
                                    type="text"
                                    className="w-full text-4xl md:text-5xl font-bold text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 border-none outline-none bg-transparent p-0"
                                    placeholder="Enter your title..."
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="group h-full blog-editor-container">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2 group-focus-within:text-blue-500 transition-colors">
                                    <Layout size={16} /> Content
                                </label>
                                <ReactQuill
                                    ref={quillRef}
                                    theme="snow"
                                    value={formData.content}
                                    onChange={(content) => setFormData({ ...formData, content })}
                                    modules={modules}
                                    className="h-[500px] mb-12"
                                    placeholder="Tell your story..."
                                />
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden min-h-[calc(100vh-12rem)]"
                    >
                        {formData.hero_image && (
                            <div className="w-full h-64 md:h-96 relative">
                                <img src={formData.hero_image} alt={formData.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            </div>
                        )}
                        <div className="p-8 md:p-12">
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8 font-sans tracking-tight">
                                {formData.title || <span className="text-gray-300 dark:text-gray-600 italic">Untitled Story</span>}
                            </h1>
                            <div className="prose prose-lg dark:prose-invert max-w-none ql-editor">
                                {formData.content ? (
                                    <div dangerouslySetInnerHTML={{ __html: formData.content }} />
                                ) : (
                                    <p className="text-gray-300 dark:text-gray-600 italic">No content yet...</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default BlogEditor;
