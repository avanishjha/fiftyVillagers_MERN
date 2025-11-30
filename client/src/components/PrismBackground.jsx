import React from 'react';
import { motion } from 'framer-motion';

const PrismBackground = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Light Mode Prism Effect */}
            <div className="absolute inset-0 bg-white dark:bg-gray-900 transition-colors duration-500" />

            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0deg,#ff0000_60deg,transparent_120deg,#00ff00_180deg,transparent_240deg,#0000ff_300deg,transparent_360deg)] opacity-10 dark:opacity-5 blur-3xl"
            />

            <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-3xl" />

            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white dark:to-gray-900" />
        </div>
    );
};

export default PrismBackground;
