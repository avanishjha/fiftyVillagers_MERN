import React from 'react';
import { motion } from 'framer-motion';

const Marquee = () => {
    const marqueeVariants = {
        animate: {
            x: [0, -1035],
            transition: {
                x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 20,
                    ease: "linear",
                },
            },
        },
    };

    const items = [
        "Education for All", "Community Service", "Empowerment", "Holistic Development",
        "Leadership", "Integrity", "Compassion", "Innovation", "Sustainability"
    ];

    return (
        <div className="relative w-full overflow-hidden bg-emerald-700 dark:bg-emerald-900 py-4 border-y border-white/10">
            <div className="flex whitespace-nowrap">
                <motion.div
                    className="flex gap-16 items-center"
                    variants={marqueeVariants}
                    animate="animate"
                >
                    {[...items, ...items, ...items].map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <span className="text-xl md:text-2xl font-bold text-white uppercase tracking-wider font-sans opacity-80">
                                {item}
                            </span>
                            <span className="w-2 h-2 bg-white rounded-full opacity-50" />
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default Marquee;
