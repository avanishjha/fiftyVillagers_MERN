import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Download, Printer, ArrowLeft } from 'lucide-react';
import api from '../../api/axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import logo from '../../assets/logo.jpg';

const AdmitCard = () => {
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const navigate = useNavigate();

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

    const handleDownloadPDF = async () => {
        const element = document.getElementById('admit-card');
        if (!element) return;

        setDownloading(true);
        try {
            const canvas = await html2canvas(element, {
                scale: 4, // Higher scale for better quality
                useCORS: true, // Enable CORS for images
                logging: false
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`AdmitCard_${application.roll_number}.pdf`);
        } catch (err) {
            console.error("PDF Generation Failed", err);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setDownloading(false);
        }
    };

    if (loading) return <div className="text-center mt-20 text-white">Loading...</div>;

    if (!application || application.status !== 'approved') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-white">
                <h2 className="text-2xl font-bold mb-4">Admit Card Not Available</h2>
                <p className="text-gray-400 mb-6">Your application is not approved yet.</p>
                <button onClick={() => navigate('/student/dashboard')} className="bg-emerald-500 px-6 py-2 rounded-lg">Go to Dashboard</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Actions Bar */}
                <div className="flex justify-between items-center mb-8 print:hidden">
                    <button onClick={() => navigate('/student/dashboard')} className="flex items-center gap-2 text-gray-400 hover:text-white">
                        <ArrowLeft size={20} /> Back to Dashboard
                    </button>
                    <button
                        onClick={handleDownloadPDF}
                        disabled={downloading}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-bold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {downloading ? 'Generating PDF...' : (
                            <>
                                <Download size={20} /> Download PDF
                            </>
                        )}
                    </button>
                </div>

                {/* Admit Card Template */}
                <div className="bg-white text-black p-8 rounded-xl shadow-2xl print:shadow-none print:p-0" id="admit-card">
                    {/* Header */}
                    <div className="border-b-2 border-gray-800 pb-6 mb-6 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            {/* Logo */}
                            <img src={logo} alt="Logo" className="w-20 h-20 object-contain" />
                            <div>
                                <h1 className="text-2xl font-bold uppercase tracking-wider">Fifty Villagers</h1>
                                <p className="text-sm font-semibold text-gray-600">Scholarship Examination 2025</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h2 className="text-xl font-bold uppercase bg-gray-900 text-white px-4 py-1 inline-block rounded">Admit Card</h2>
                            <p className="text-sm font-mono mt-2">Roll No: <span className="font-bold text-lg">{application.roll_number}</span></p>
                        </div>
                    </div>

                    {/* Student Details */}
                    <div className="grid grid-cols-3 gap-8 mb-8">
                        <div className="col-span-2 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Student Name</p>
                                    <p className="font-bold text-lg">{application.father_name}</p> {/* Using father_name as proxy if student name not in app table, ideally join user table */}
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Date of Birth</p>
                                    <p className="font-semibold">{new Date(application.dob).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Gender</p>
                                    <p className="font-semibold">{application.gender}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Category</p>
                                    <p className="font-semibold">{application.exam_category}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-xs text-gray-500 uppercase font-bold">Father's Name</p>
                                    <p className="font-semibold">{application.father_name}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1 flex justify-end">
                            <div className="w-32 h-40 border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-100">
                                {application.photo_url ? (
                                    <img src={application.photo_url} alt="Student" className="w-full h-full object-cover" crossOrigin="anonymous" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Photo</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Exam Center Details */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
                        <h3 className="text-lg font-bold border-b border-gray-300 pb-2 mb-4 uppercase">Exam Center Details</h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold">Center Name</p>
                                <p className="font-bold text-lg">{application.exam_center_name || "TBD"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold">Exam Date & Time</p>
                                <p className="font-bold text-lg text-emerald-700">
                                    {application.exam_date ? new Date(application.exam_date).toLocaleString() : "TBD"}
                                </p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-xs text-gray-500 uppercase font-bold">Center Address</p>
                                <p className="font-medium">{application.exam_center_location || "TBD"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="mb-8">
                        <h3 className="text-sm font-bold uppercase mb-3 text-gray-700">Important Instructions</h3>
                        <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                            <li>Please bring this Admit Card along with a valid Government ID proof (Aadhar Card/School ID).</li>
                            <li>Reach the exam center at least 30 minutes before the scheduled time.</li>
                            <li>Electronic gadgets like mobile phones, smartwatches, and calculators are strictly prohibited.</li>
                            <li>Use only Blue/Black ballpoint pen for marking answers.</li>
                        </ul>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-end mt-12 pt-8 border-t border-gray-200">
                        <div className="text-center">
                            {application.signature_url && (
                                <img src={application.signature_url} alt="Signature" className="h-12 object-contain mb-2" crossOrigin="anonymous" />
                            )}
                            <p className="text-xs font-bold border-t border-gray-400 pt-1 px-4">Student Signature</p>
                        </div>
                        <div className="text-center">
                            <div className="h-12 mb-2"></div> {/* Placeholder for authority signature */}
                            <p className="text-xs font-bold border-t border-gray-400 pt-1 px-4">Controller of Examinations</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdmitCard;
