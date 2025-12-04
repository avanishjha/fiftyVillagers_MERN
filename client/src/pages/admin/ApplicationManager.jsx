import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, CheckCircle, XCircle, AlertCircle, FileText, Download, ChevronDown, ChevronUp, User } from 'lucide-react';
import api from '../../api/axios';
import EmptyState from '../../components/EmptyState';
import Pagination from '../../components/Pagination';

const ApplicationManager = () => {
    const [applications, setApplications] = useState([]);
    const [filteredApps, setFilteredApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [expandedId, setExpandedId] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });

    // Correction Modal State
    const [correctionId, setCorrectionId] = useState(null);
    const [correctionNote, setCorrectionNote] = useState('');

    useEffect(() => {
        fetchApplications(pagination.page);
    }, [pagination.page]);

    useEffect(() => {
        let result = applications;
        if (statusFilter !== 'all') {
            result = result.filter(app => app.status === statusFilter);
        }
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(app =>
                app.student_name.toLowerCase().includes(lowerTerm) ||
                app.student_email.toLowerCase().includes(lowerTerm) ||
                app.id.toString().includes(lowerTerm)
            );
        }
        setFilteredApps(result);
    }, [applications, searchTerm, statusFilter]);

    const fetchApplications = async (page = 1) => {
        try {
            setLoading(true);
            const res = await api.get(`/applications?page=${page}&limit=${pagination.limit}`);
            setApplications(res.data.data);
            setPagination(prev => ({ ...prev, ...res.data.pagination }));
        } catch (err) {
            console.error("Failed to fetch applications", err);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateAdmitCard = async (id) => {
        try {
            setActionLoading(id);
            await api.post('/exam/generate-admit-card', { applicationId: id });
            // Refresh list
            fetchApplications(pagination.page);
        } catch (err) {
            console.error("Failed to generate admit card", err);
            alert("Failed to generate admit card");
        } finally {
            setActionLoading(null);
        }
    };

    const handleStatusUpdate = async (id, status, notes = null) => {
        if (!window.confirm(`Are you sure you want to mark this application as ${status}?`)) return;

        setActionLoading(id);
        try {
            const res = await api.put(`/applications/${id}/status`, {
                status,
                correction_notes: notes
            });

            setApplications(apps => apps.map(app =>
                app.id === id ? { ...app, status: res.data.status, correction_notes: res.data.correction_notes } : app
            ));
            setCorrectionId(null);
            setCorrectionNote('');
        } catch (err) {
            console.error(err);
            alert('Failed to update status');
        } finally {
            setActionLoading(null);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
            case 'correction': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default: return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Student Applications</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Review and manage student admissions</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search students..."
                            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <select
                            className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="correction">Correction</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>
            </div>

            {filteredApps.length === 0 ? (
                <EmptyState message="No applications found" icon={FileText} />
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredApps.map((app) => (
                                    <React.Fragment key={app.id}>
                                        <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                #{app.id.toString().padStart(4, '0')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                                                        <User size={16} />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{app.student_name}</div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">{app.student_email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {app.exam_category}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(app.submitted_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(app.status)}`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                                                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center justify-end gap-1 ml-auto"
                                                >
                                                    {expandedId === app.id ? 'Hide Details' : 'View Details'}
                                                    {expandedId === app.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                </button>
                                            </td>
                                        </tr>

                                        {/* Expanded Details */}
                                        <AnimatePresence>
                                            {expandedId === app.id && (
                                                <motion.tr
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                >
                                                    <td colSpan="6" className="bg-gray-50 dark:bg-gray-900/30 px-6 py-6 border-b border-gray-200 dark:border-gray-700">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                            <div className="space-y-4">
                                                                <h4 className="font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Personal Information</h4>
                                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                                    <div>
                                                                        <p className="text-gray-500 dark:text-gray-400">Father's Name</p>
                                                                        <p className="font-medium text-gray-900 dark:text-white">{app.father_name}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-gray-500 dark:text-gray-400">Father's Occupation</p>
                                                                        <p className="font-medium text-gray-900 dark:text-white">{app.father_occupation || 'N/A'}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-gray-500 dark:text-gray-400">Date of Birth</p>
                                                                        <p className="font-medium text-gray-900 dark:text-white">{new Date(app.dob).toLocaleDateString()}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-gray-500 dark:text-gray-400">Gender</p>
                                                                        <p className="font-medium text-gray-900 dark:text-white">{app.gender}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-gray-500 dark:text-gray-400">Mobile</p>
                                                                        <p className="font-medium text-gray-900 dark:text-white">{app.phone}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-gray-500 dark:text-gray-400">Secondary Mobile</p>
                                                                        <p className="font-medium text-gray-900 dark:text-white">{app.mobile_secondary || 'N/A'}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-gray-500 dark:text-gray-400">Aadhar Number</p>
                                                                        <p className="font-medium text-gray-900 dark:text-white">{app.aadhar_number || 'N/A'}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-gray-500 dark:text-gray-400">Family Members</p>
                                                                        <p className="font-medium text-gray-900 dark:text-white">{app.family_members || 'N/A'}</p>
                                                                    </div>
                                                                    <div className="col-span-2">
                                                                        <p className="text-gray-500 dark:text-gray-400">Address</p>
                                                                        <p className="font-medium text-gray-900 dark:text-white">{app.address}</p>
                                                                        <p className="text-sm text-gray-500">Pincode: {app.pincode || 'N/A'}</p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-4">
                                                                <h4 className="font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Academic & Special Info</h4>
                                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                                    <div className="col-span-2">
                                                                        <p className="text-gray-500 dark:text-gray-400">School Name</p>
                                                                        <p className="font-medium text-gray-900 dark:text-white">{app.school_name || 'N/A'}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-gray-500 dark:text-gray-400">Class</p>
                                                                        <p className="font-medium text-gray-900 dark:text-white">{app.exam_category}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-gray-500 dark:text-gray-400">10th Passing Year</p>
                                                                        <p className="font-medium text-gray-900 dark:text-white">{app.passing_year_10th || 'N/A'}</p>
                                                                    </div>
                                                                    <div className="col-span-2">
                                                                        <p className="text-gray-500 dark:text-gray-400">Special Conditions</p>
                                                                        <div className="flex flex-wrap gap-2 mt-1">
                                                                            {(() => {
                                                                                try {
                                                                                    const conditions = JSON.parse(app.special_condition || '[]');
                                                                                    return conditions.length > 0 ? (
                                                                                        conditions.map((c, i) => (
                                                                                            <span key={i} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full border border-yellow-200">
                                                                                                {c}
                                                                                            </span>
                                                                                        ))
                                                                                    ) : <span className="text-gray-400 italic">None</span>;
                                                                                } catch (e) {
                                                                                    return <span className="text-gray-400 italic">None</span>;
                                                                                }
                                                                            })()}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <h4 className="font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mt-4">Documents</h4>
                                                                <div className="grid grid-cols-3 gap-4">
                                                                    {['photo_url', 'signature_url', 'id_proof_url'].map((field) => (
                                                                        <div key={field} className="text-center">
                                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 capitalize">{field.replace('_url', '').replace('_', ' ')}</p>
                                                                            {app[field] ? (
                                                                                <a href={app[field]} target="_blank" rel="noopener noreferrer" className="block relative group">
                                                                                    {field === 'id_proof_url' && app[field].endsWith('.pdf') ? (
                                                                                        <div className="h-24 w-full bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-gray-500">
                                                                                            <FileText size={24} />
                                                                                        </div>
                                                                                    ) : (
                                                                                        <img src={app[field]} alt={field} className="h-24 w-full object-cover rounded border border-gray-200 dark:border-gray-700" />
                                                                                    )}
                                                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
                                                                                        <Download className="text-white" size={20} />
                                                                                    </div>
                                                                                </a>
                                                                            ) : (
                                                                                <div className="h-24 w-full bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center text-gray-400 text-xs">
                                                                                    Not Uploaded
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                                                            {correctionId === app.id ? (
                                                                <div className="flex items-center gap-2 w-full max-w-lg">
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Enter correction notes..."
                                                                        className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
                                                                        value={correctionNote}
                                                                        onChange={(e) => setCorrectionNote(e.target.value)}
                                                                    />
                                                                    <button
                                                                        onClick={() => handleStatusUpdate(app.id, 'correction', correctionNote)}
                                                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg text-sm font-medium"
                                                                        disabled={!correctionNote}
                                                                    >
                                                                        Send
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setCorrectionId(null)}
                                                                        className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg text-sm font-medium"
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <button
                                                                        onClick={() => handleStatusUpdate(app.id, 'approved')}
                                                                        disabled={actionLoading === app.id}
                                                                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                                                    >
                                                                        <CheckCircle size={16} /> Approve
                                                                    </button>
                                                                    {app.status === 'approved' && !app.roll_number && (
                                                                        <button
                                                                            onClick={() => handleGenerateAdmitCard(app.id)}
                                                                            disabled={actionLoading === app.id}
                                                                            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                                                        >
                                                                            <FileText size={16} /> Generate Admit Card
                                                                        </button>
                                                                    )}
                                                                    <button
                                                                        onClick={() => setCorrectionId(app.id)}
                                                                        disabled={actionLoading === app.id}
                                                                        className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                                                    >
                                                                        <AlertCircle size={16} /> Request Correction
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleStatusUpdate(app.id, 'rejected')}
                                                                        disabled={actionLoading === app.id}
                                                                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                                                    >
                                                                        <XCircle size={16} /> Reject
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            )}
                                        </AnimatePresence>
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.totalPages}
                            onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplicationManager;
