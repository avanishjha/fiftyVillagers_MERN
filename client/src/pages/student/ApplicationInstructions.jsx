import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, Calendar, MapPin, AlertCircle, ArrowRight } from 'lucide-react';

const ApplicationInstructions = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
                >
                    {/* Header */}
                    <div className="bg-emerald-600 dark:bg-emerald-700 px-8 py-10 text-center text-white relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-4 relative z-10">Fifty Villagers Seva Sansthan (Reg.)</h1>
                        <p className="text-emerald-100 text-lg relative z-10">Near Sadar Police Station, Shastri Nagar, Barmer</p>
                        <div className="mt-6 inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 border border-white/30 relative z-10">
                            <span className="font-semibold">Admission Open: 01 Dec 2025 - 29 Mar 2026</span>
                        </div>
                    </div>

                    <div className="p-8 md:p-12 space-y-10 text-gray-700 dark:text-gray-300">

                        {/* Target Audience */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm">01</span>
                                Who is 50 Villagers for?
                            </h2>
                            <ul className="space-y-3 pl-12">
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0" />
                                    <span>Promising students from rural areas of all castes and religions.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0" />
                                    <span>Needy students from <strong>Barmer, Balotra, Jaisalmer, Phalodi, Jalore, and Jodhpur</strong> who secured First Division in 10th grade but cannot afford Biology stream (Medical) due to financial constraints.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0" />
                                    <span>Students who are orphans, or children of farmers, laborers, or economically weak parents.</span>
                                </li>
                            </ul>
                        </section>

                        {/* Eligibility */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm">02</span>
                                Eligibility for Entrance Exam
                            </h2>
                            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2.5"></div>
                                        <span>Govt school students from rural/urban areas of mentioned districts with <strong>First Division in 10th</strong>.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2.5"></div>
                                        <span>Economically weak and needy students.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2.5"></div>
                                        <span>Currently studying regularly in <strong>9th or 10th grade</strong> in a government school.</span>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* Exam Details Grid */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <section className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800/50">
                                <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-4 flex items-center gap-2">
                                    <Calendar className="w-5 h-5" /> Exam Date & Time
                                </h3>
                                <p className="font-semibold text-lg mb-1">29 March 2026, Sunday</p>
                                <p className="text-blue-700 dark:text-blue-400">1:00 PM to 3:00 PM</p>
                                <p className="text-xs mt-3 text-blue-600/80 dark:text-blue-400/80">* Reach by 11:00 AM with guardian</p>
                            </section>

                            <section className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-2xl border border-purple-100 dark:border-purple-800/50">
                                <h3 className="font-bold text-purple-900 dark:text-purple-300 mb-4 flex items-center gap-2">
                                    <MapPin className="w-5 h-5" /> Exam Venue
                                </h3>
                                <p className="font-medium">Kalam Ashram</p>
                                <p className="text-purple-700 dark:text-purple-400 text-sm mt-1">Beyond Dhapu Bai College, Bhurtiya Road, Barmer</p>
                            </section>
                        </div>

                        {/* Documents & Syllabus */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <section>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-3">Documents Required (Exam Day)</h3>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center gap-2"><FileText size={16} className="text-emerald-500" /> 1 Photocopy of Aadhar Card</li>
                                    <li className="flex items-center gap-2"><FileText size={16} className="text-emerald-500" /> 2 Passport Size Photos</li>
                                    <li className="flex items-center gap-2"><FileText size={16} className="text-emerald-500" /> 2 Photocopies of 10th Marksheet</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-3">Syllabus (Objective Type)</h3>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-1"><span>9th & 10th Science</span> <span className="font-semibold">40 Marks</span></li>
                                    <li className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-1"><span>Basic Math</span> <span className="font-semibold">20 Marks</span></li>
                                    <li className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-1"><span>English Grammar</span> <span className="font-semibold">20 Marks</span></li>
                                    <li className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-1"><span>Hindi Grammar</span> <span className="font-semibold">20 Marks</span></li>
                                </ul>
                            </section>
                        </div>

                        {/* Footer Action */}
                        <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                <AlertCircle size={16} />
                                <span>Form Fee: ₹100 (Includes past papers)</span>
                            </div>
                            <button
                                onClick={() => navigate('/student/register')}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center gap-2"
                            >
                                Proceed to Application <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ApplicationInstructions;
