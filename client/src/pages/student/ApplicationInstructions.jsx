import React from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, AlertCircle, ArrowRight, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const ApplicationInstructions = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
                >
                    <div className="bg-emerald-600 p-8 text-white">
                        <h1 className="text-3xl font-bold mb-2">Application Guidelines</h1>
                        <p className="opacity-90 text-lg">Fifty Villagers Service Institute Entrance Exam - 2025</p>
                    </div>

                    <div className="p-8 space-y-8">
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <FileText className="text-emerald-600" /> Required Information
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                Students must provide the following information while filling out the form:
                            </p>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700 dark:text-gray-300">
                                {[
                                    "Student Name",
                                    "Father's Name",
                                    "Father's Occupation",
                                    "School Name",
                                    "Date of Birth",
                                    "Class (9th/10th/11th/12th)",
                                    "Year of Passing 10th Class",
                                    "Permanent Address",
                                    "Aadhar Number",
                                    "Mobile Number"
                                ].map((item, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
                            <h2 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                                <AlertCircle size={20} /> Important Notes
                            </h2>
                            <ul className="space-y-3 text-blue-800 dark:text-blue-200 text-sm">
                                <li className="flex gap-2">
                                    <span className="font-bold">•</span>
                                    <span>After completing all steps, students will receive a unique <strong>Registration ID</strong> and <strong>Password</strong>.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="font-bold">•</span>
                                    <span><strong>Payment:</strong> Students must pay the examination fee via online mode before the final submission of the form.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="font-bold">•</span>
                                    <span>After payment, keep a copy of the finally submitted form (PDF or other document format) safely.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="font-bold">•</span>
                                    <span>It is <strong>mandatory</strong> to bring the copy of the finally submitted form on the day of the examination.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="font-bold">•</span>
                                    <span>Once the form is finally submitted, students can log in at any time.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="font-bold">•</span>
                                    <span>Previous year question papers of the institute's entrance exams will be delivered to the students' permanent address.</span>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Phone className="text-emerald-600" /> Helpline
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-2">
                                For any information regarding registration, question paper booklet, or examination, please call the following helpline numbers:
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {["8302599508", "8769267930", "6378634149", "8824306289"].map((num) => (
                                    <a
                                        key={num}
                                        href={`tel:${num}`}
                                        className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg font-mono font-medium text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors"
                                    >
                                        {num}
                                    </a>
                                ))}
                            </div>
                        </section>

                        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                            <Link
                                to="/student/register"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                                Proceed to Registration <ArrowRight size={20} />
                            </Link>
                            <Link
                                to="/student/login"
                                className="bg-white border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 text-lg font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                                Already Registered? Login
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ApplicationInstructions;
