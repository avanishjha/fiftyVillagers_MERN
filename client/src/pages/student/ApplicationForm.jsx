import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Send, Upload, AlertCircle, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import api from '../../api/axios';
import ParallaxSection from '../../components/ParallaxSection';
import Stepper from '../../components/Stepper';

const ApplicationForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [applicationStatus, setApplicationStatus] = useState(null); // 'pending', 'submitted', 'approved', etc.

    const steps = ["Personal Details", "Contact Info", "Academic Details", "Documents"];

    const [formData, setFormData] = useState({
        student_id: '',
        father_name: '',
        father_occupation: '',
        family_members: '',
        dob: '',
        gender: '',
        address: '',
        pincode: '',
        phone: '',
        mobile_secondary: '',
        aadhar_number: '',
        school_name: '',
        passing_year_10th: '',
        photo_url: '',
        signature_url: '',
        id_proof_url: '',
        exam_category: '',
        special_condition: ''
    });

    const isReadOnly = applicationStatus === 'submitted' || applicationStatus === 'approved' || applicationStatus === 'rejected';

    useEffect(() => {
        const loadData = async () => {
            try {
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    setFormData(prev => ({ ...prev, student_id: user.id }));
                }

                const res = await api.get('/applications/my-application');
                if (res.data) {
                    // Ensure dates are formatted for input type="date"
                    const formattedData = {
                        ...res.data,
                        dob: res.data.dob ? res.data.dob.split('T')[0] : ''
                    };
                    setFormData(formattedData);
                    setApplicationStatus(res.data.status);

                    // If submitted, go to last step or show summary
                    if (res.data.status === 'submitted' || res.data.status === 'approved') {
                        // Optional: Redirect to dashboard or show read-only view
                    }
                } else {
                    // Load from local storage if no server data
                    const saved = localStorage.getItem('student_application_form');
                    if (saved) {
                        setFormData(JSON.parse(saved));
                    }
                }
            } catch (err) {
                console.error("Failed to fetch application", err);
            } finally {
                setIsLoaded(true);
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        if (isLoaded && !isReadOnly) {
            localStorage.setItem('student_application_form', JSON.stringify(formData));
        }
    }, [formData, isLoaded, isReadOnly]);

    const handleChange = (e) => {
        if (isReadOnly) return;
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = async (e, fieldName) => {
        if (isReadOnly) return;
        const file = e.target.files[0];
        if (!file) return;

        const data = new FormData();
        data.append('file', file);

        try {
            const res = await api.post('/upload', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData(prev => ({ ...prev, [fieldName]: res.data.url }));
        } catch (err) {
            console.error("Upload failed", err);
            alert("File upload failed");
        }
    };

    const handleSaveDraft = async () => {
        try {
            setLoading(true);
            await api.post('/applications', { ...formData, status: 'pending' });
            alert("Draft Saved Successfully!");
        } catch (err) {
            console.error("Save draft failed", err);
            alert("Failed to save draft.");
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        if (!formData.father_name || !formData.phone || !formData.photo_url) {
            alert("Please fill all required fields before paying.");
            return;
        }

        try {
            console.log("Starting payment flow...");
            setLoading(true);
            // 1. Save Application First
            console.log("Saving application...");
            const saveRes = await api.post('/applications', { ...formData, status: 'pending' });
            const applicationId = saveRes.data.id;
            console.log("Application Saved. ID:", applicationId);

            // 2. Create Order
            const orderRes = await api.post('/payment/create-order', { amount: 103 }); // 103 INR
            const { id: order_id, amount, currency, key_id } = orderRes.data;

            // 3. Open Razorpay
            const options = {
                key: key_id,
                amount: amount,
                currency: currency,
                name: "Fify Villagers",
                description: "Application Fee",
                order_id: order_id,
                handler: async function (response) {
                    try {
                        await api.post('/payment/verify-payment', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            applicationId: applicationId
                        });
                        localStorage.removeItem('student_application_form');
                        alert("Payment Successful! Application Submitted.");
                        setApplicationStatus('submitted');
                        navigate('/student/dashboard');
                    } catch (err) {
                        console.error("Payment Verification Error:", err);
                        alert("Payment Verification Failed. Please contact support.");
                    }
                },
                prefill: {
                    name: formData.father_name, // Using father's name as proxy or fetch user name
                    contact: formData.phone
                },
                theme: {
                    color: "#10b981"
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                alert("Payment Failed: " + response.error.description);
                console.error("Payment Failed:", response.error);
            });
            rzp1.open();

        } catch (err) {
            console.error("Payment Initialization Failed", err);
            alert("Failed to initialize payment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

    const renderStepContent = (stepIndex) => {
        switch (stepIndex) {
            case 0: // Personal Details
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="Father's Name" name="father_name" value={formData.father_name} onChange={handleChange} required disabled={isReadOnly} />
                        <InputField label="Father's Occupation" name="father_occupation" value={formData.father_occupation} onChange={handleChange} disabled={isReadOnly} />
                        <InputField label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} required disabled={isReadOnly} />
                        <SelectField label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={["Male", "Female", "Other"]} required disabled={isReadOnly} />
                        <InputField label="Family Members" name="family_members" type="number" value={formData.family_members} onChange={handleChange} disabled={isReadOnly} />
                        <InputField label="Aadhar Number" name="aadhar_number" value={formData.aadhar_number} onChange={handleChange} disabled={isReadOnly} />
                    </div>
                );
            case 1: // Contact Info
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required disabled={isReadOnly} />
                        <InputField label="Secondary Mobile" name="mobile_secondary" value={formData.mobile_secondary} onChange={handleChange} disabled={isReadOnly} />
                        <div className="md:col-span-2">
                            <TextAreaField label="Address" name="address" value={formData.address} onChange={handleChange} required disabled={isReadOnly} />
                        </div>
                        <InputField label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} disabled={isReadOnly} />
                    </div>
                );
            case 2: // Academic Details
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="School Name" name="school_name" value={formData.school_name} onChange={handleChange} disabled={isReadOnly} />
                        <InputField label="10th Passing Year" name="passing_year_10th" type="number" value={formData.passing_year_10th} onChange={handleChange} disabled={isReadOnly} />
                        <SelectField label="Exam Category" name="exam_category" value={formData.exam_category} onChange={handleChange} options={["Science", "Arts", "Commerce"]} required disabled={isReadOnly} />
                        <div className="md:col-span-2">
                            <TextAreaField label="Special Condition (if any)" name="special_condition" value={formData.special_condition} onChange={handleChange} disabled={isReadOnly} />
                        </div>
                    </div>
                );
            case 3: // Documents
                return (
                    <div className="space-y-6">
                        <FileUploadField label="Student Photo" name="photo_url" value={formData.photo_url} onChange={(e) => handleFileUpload(e, 'photo_url')} required disabled={isReadOnly} />
                        <FileUploadField label="Signature" name="signature_url" value={formData.signature_url} onChange={(e) => handleFileUpload(e, 'signature_url')} disabled={isReadOnly} />
                        <FileUploadField label="ID Proof (Aadhar/School ID)" name="id_proof_url" value={formData.id_proof_url} onChange={(e) => handleFileUpload(e, 'id_proof_url')} disabled={isReadOnly} />
                    </div>
                );
            default:
                return null;
        }
    };

    if (!isLoaded) return <div className="text-white text-center mt-20">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800 border border-gray-700 rounded-3xl p-8 md:p-12 shadow-2xl"
                >
                    <div className="mb-12 text-center">
                        <h1 className="text-4xl font-bold text-white mb-4 font-sans">Scholarship Application</h1>
                        <p className="text-gray-400 text-lg">Complete the form below to apply for the scholarship program.</p>
                        {isReadOnly && (
                            <div className="mt-6 flex flex-col items-center gap-4">
                                <div className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 px-6 py-3 rounded-xl flex items-center gap-3">
                                    <CheckCircle size={24} />
                                    <span className="font-semibold">Application Submitted Successfully</span>
                                </div>
                                <button
                                    onClick={() => navigate('/student/dashboard')}
                                    className="bg-white text-black hover:bg-gray-200 font-bold py-3 px-8 rounded-xl transition-all flex items-center gap-2 shadow-lg"
                                >
                                    Go to Dashboard <ArrowRight size={20} />
                                </button>
                            </div>
                        )}
                    </div>

                    <Stepper steps={steps} currentStep={currentStep} />

                    <div className="mt-12 min-h-[400px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {renderStepContent(currentStep)}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="mt-16 flex justify-between items-center pt-8 border-t border-gray-700">
                        <button
                            onClick={prevStep}
                            disabled={currentStep === 0}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${currentStep === 0
                                ? 'text-gray-600 cursor-not-allowed'
                                : 'text-gray-300 hover:text-white hover:bg-gray-700'
                                }`}
                        >
                            <ArrowLeft size={20} /> Previous
                        </button>

                        <div className="flex gap-4">
                            {!isReadOnly && (
                                <button
                                    onClick={handleSaveDraft}
                                    disabled={loading}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10 transition-all"
                                >
                                    <Save size={20} /> Save Draft
                                </button>
                            )}

                            {currentStep < steps.length - 1 ? (
                                <button
                                    onClick={nextStep}
                                    className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold bg-white text-black hover:bg-gray-200 transition-all shadow-lg shadow-white/10"
                                >
                                    Next <ArrowRight size={20} />
                                </button>
                            ) : (
                                !isReadOnly && (
                                    <button
                                        onClick={handlePayment}
                                        disabled={loading}
                                        className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white transition-all shadow-lg shadow-emerald-500/20"
                                    >
                                        {loading ? 'Processing...' : 'Pay & Submit (₹103)'} <Send size={20} />
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );

};

// Helper Components
const InputField = ({ label, name, type = "text", value, onChange, required, disabled }) => (
    <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300 ml-1">{label} {required && <span className="text-red-400">*</span>}</label>
        <input
            type={type}
            name={name}
            value={value || ''}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className="w-full bg-black/30 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />
    </div>
);

const TextAreaField = ({ label, name, value, onChange, required, disabled }) => (
    <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300 ml-1">{label} {required && <span className="text-red-400">*</span>}</label>
        <textarea
            name={name}
            value={value || ''}
            onChange={onChange}
            required={required}
            disabled={disabled}
            rows="3"
            className="w-full bg-black/30 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />
    </div>
);

const SelectField = ({ label, name, value, onChange, options, required, disabled }) => (
    <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300 ml-1">{label} {required && <span className="text-red-400">*</span>}</label>
        <select
            name={name}
            value={value || ''}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className="w-full bg-black/30 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <option value="">Select {label}</option>
            {options.map(opt => (
                <option key={opt} value={opt} className="bg-gray-900">{opt}</option>
            ))}
        </select>
    </div>
);

const FileUploadField = ({ label, name, value, onChange, required, disabled }) => (
    <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300 ml-1">{label} {required && <span className="text-red-400">*</span>}</label>
        <div className="relative">
            <input
                type="file"
                onChange={onChange}
                disabled={disabled}
                className="w-full bg-black/30 border border-white/10 rounded-xl py-3 px-4 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-500/20 file:text-emerald-400 hover:file:bg-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {value && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 flex items-center gap-2 bg-black/50 px-2 py-1 rounded-lg">
                    <CheckCircle size={16} /> <span className="text-xs">Uploaded</span>
                </div>
            )}
        </div>
        {value && (
            <div className="mt-2">
                <img src={`${api.defaults.baseURL}${value}`} alt="Preview" className="h-20 rounded-lg border border-white/20 object-cover" />
            </div>
        )}
    </div>
);

export default ApplicationForm;
