import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const Stepper = ({ steps, currentStep }) => {
    return (
        <div className="w-full max-w-3xl mx-auto py-6">
            <div className="flex items-center justify-between relative">
                {/* Progress Bar Background */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full -z-0" />

                {/* Active Progress Bar */}
                <motion.div
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-emerald-500 rounded-full -z-0"
                    initial={{ width: '0%' }}
                    animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />

                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep;

                    return (
                        <div key={index} className="relative z-10 flex flex-col items-center">
                            <motion.div
                                initial={false}
                                animate={{
                                    backgroundColor: isCompleted || isCurrent ? '#10b981' : 'var(--bg-step-inactive)',
                                    borderColor: isCompleted || isCurrent ? '#10b981' : 'var(--border-step-inactive)',
                                    scale: isCurrent ? 1.1 : 1,
                                }}
                                style={{
                                    '--bg-step-inactive': 'var(--color-bg-step, #f3f4f6)', // gray-100 default
                                    '--border-step-inactive': 'var(--color-border-step, #d1d5db)' // gray-300 default
                                }}
                                transition={{ duration: 0.3 }}
                                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 ${isCompleted || isCurrent ? 'text-white' : 'text-gray-400 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                                    } shadow-sm`}
                            >
                                {isCompleted ? (
                                    <Check size={16} />
                                ) : (
                                    <span className="text-xs sm:text-sm font-bold">{index + 1}</span>
                                )}
                            </motion.div>
                            <div className="absolute top-10 sm:top-12 w-32 text-center -ml-12 left-1/2">
                                <p
                                    className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${isCurrent ? 'text-emerald-600 dark:text-emerald-400' : isCompleted ? 'text-emerald-600 dark:text-emerald-500' : 'text-gray-400 dark:text-gray-500'
                                        }`}
                                >
                                    {step}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Stepper;
