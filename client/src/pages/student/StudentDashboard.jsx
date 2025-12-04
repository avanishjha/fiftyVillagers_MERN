import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, Clock, AlertCircle, Download, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const StudentDashboard = () => {
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const res = await api.get('/applications/my-application');
                setApplication(res.data);
            } catch (err) {
                console.error("Failed to fetch application", err);
            } finally {
                setLoading(false);
            }
        };
        fetchApplication();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
            case 'correction': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default: return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700 flex justify-between items-center"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Welcome back, <span className="text-emerald-600">{user.name}</span>!
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">Manage your application and exam details here.</p>
                    </div>
                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
                            localStorage.removeItem('user');
                            window.location.href = '/student/login';
                        }}
                        className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        Logout
                    </button>
                </motion.div>

                {/* Application Status Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700"
                >
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <FileText className="text-emerald-500" /> Application Status
                        </h2>
                        {application && (
                            <div className="flex items-center gap-3">
                                <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getStatusColor(application.status)} uppercase tracking-wide`}>
                                    {application.status}
                                </span>
                                {application.status === 'approved' && application.roll_number && (
                                    <Link
                                        to="/student/admit-card"
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-md transition-all"
                                    >
                                        <FileText size={16} /> View Admit Card
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="p-8">
                        {!application ? (
                            <div className="text-center py-8">
                                <div className="bg-gray-100 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                    <FileText size={32} />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Application Found</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">You haven't submitted your application yet.</p>
                                <Link
                                    to="/student/apply"
                                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    Start Application
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Application ID</p>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">#{application.id.toString().padStart(6, '0')}</p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Exam Category</p>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">{application.exam_category}</p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Submitted On</p>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                                            {new Date(application.submitted_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                {application.status === 'correction' && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                                        <AlertCircle className="text-yellow-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-yellow-800">Correction Required</h4>
                                            <p className="text-yellow-700 mt-1">{application.correction_notes}</p>
                                            <Link to="/student/apply" className="text-yellow-800 font-semibold hover:underline mt-2 inline-block">
                                                Edit Application &rarr;
                                            </Link>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end">
                                    <Link
                                        to="/student/apply"
                                        className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
                                    >
                                        View / Edit Details
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Admit Card & Results Section */}
                {application && application.status === 'approved' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Admit Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                                    <FileText size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Admit Card</h3>
                            </div>

                            {application.admit_url ? (
                                <div>
                                    <p className="text-gray-600 dark:text-gray-300 mb-6">Your admit card has been generated. Please download and print it for the exam.</p>
                                    <Link
                                        to="/student/admit-card"
                                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-colors shadow-lg hover:shadow-blue-500/30"
                                    >
                                        <FileText size={20} /> View & Print Admit Card
                                    </Link>
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <Clock className="mx-auto text-gray-400 mb-2" size={32} />
                                    <p className="text-gray-500 dark:text-gray-400">Admit card will be available soon.</p>
                                </div>
                            )}
                        </motion.div>

                        {/* Results */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg">
                                    <Award size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Exam Results</h3>
                            </div>

                            {/* Placeholder for results logic - assuming results table join or separate fetch */}
                            <div className="text-center py-6">
                                <Clock className="mx-auto text-gray-400 mb-2" size={32} />
                                <p className="text-gray-500 dark:text-gray-400">Results have not been declared yet.</p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
