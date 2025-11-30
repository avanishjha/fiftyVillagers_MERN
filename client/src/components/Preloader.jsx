import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ShapeBackground from './ShapeBackground';

const Preloader = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const duration = 3500;
        const interval = 35;
        const steps = duration / interval;
        const increment = 100 / steps;

        const timer = setInterval(() => {
            setProgress((prev) => {
                const next = prev + increment;
                if (next >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                return next;
            });
        }, interval);

        const completeTimer = setTimeout(() => {
            sessionStorage.setItem('hasLoaded', 'true');
            if (onComplete) onComplete();
        }, duration);

        return () => {
            clearInterval(timer);
            clearTimeout(completeTimer);
        };
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
            exit={{ y: "-100%", transition: { duration: 1, ease: [0.76, 0, 0.24, 1] } }}
        >
            <ShapeBackground>
                <div className="relative z-10 text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, filter: "blur(20px)", scale: 0.9 }}
                        animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                        exit={{ opacity: 0, y: -50, transition: { duration: 0.5 } }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="mb-8 relative z-10"
                    >
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 dark:text-white tracking-tighter font-sans mb-2">
                            Fifty<span className="text-emerald-600 dark:text-emerald-400">Villagers</span>
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -20, transition: { duration: 0.5 } }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-light tracking-[0.2em] uppercase mt-2 relative z-10"
                    >
                        - A Doctor's Initiative -
                    </motion.p>

                    {/* Loading Bar & Counter */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-12 w-64 mx-auto"
                    >
                        <div className="flex justify-between text-xs font-mono text-gray-400 dark:text-gray-500 mb-2">
                            <span>LOADING</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-emerald-600 dark:bg-emerald-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </motion.div>
                </div>
            </ShapeBackground>
        </motion.div>
    );
};

export default Preloader;
