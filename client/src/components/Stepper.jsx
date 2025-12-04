import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const Stepper = ({ steps, currentStep }) => {
    return (
        <div className="w-full py-6">
            <div className="flex items-center justify-between relative">
                {/* Progress Bar Background */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-white/10 rounded-full -z-0" />

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
                                    backgroundColor: isCompleted || isCurrent ? '#10b981' : '#1f2937', // emerald-500 or gray-800
                                    borderColor: isCompleted || isCurrent ? '#10b981' : '#374151', // emerald-500 or gray-700
                                    scale: isCurrent ? 1.2 : 1,
                                }}
                                transition={{ duration: 0.3 }}
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${isCompleted || isCurrent ? 'text-white' : 'text-gray-400'
                                    } shadow-lg`}
                            >
                                {isCompleted ? (
                                    <Check size={20} />
                                ) : (
                                    <span className="text-sm font-bold">{index + 1}</span>
                                )}
                            </motion.div>
                            <div className="absolute top-14 w-40 text-center -ml-16 left-1/2">
                                <p
                                    className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${isCurrent ? 'text-emerald-400' : isCompleted ? 'text-emerald-600' : 'text-gray-500'
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
