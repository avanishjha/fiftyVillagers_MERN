import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const stats = [
    { value: 1000, suffix: "+", label: "Students Supported" },
    { value: 12, suffix: "+", label: "Years of Service" },
    { value: 100, suffix: "%", label: "Free Education" },
    { value: 50, suffix: "", label: "Villagers" },
];

const Stats = () => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.3,
    });

    return (
        <section className="py-20 bg-emerald-700 dark:bg-emerald-900 border-y border-white/10 transition-colors duration-500 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-6 relative z-10" ref={ref}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            className="group"
                        >
                            <div className="text-5xl md:text-6xl font-bold text-white mb-4 font-sans tracking-tight group-hover:scale-110 transition-transform duration-300">
                                {inView ? (
                                    <CountUp end={stat.value} duration={2.5} separator="," />
                                ) : (
                                    0
                                )}
                                <span className="text-emerald-200">{stat.suffix}</span>
                            </div>
                            <p className="text-emerald-100 dark:text-emerald-200 uppercase tracking-widest text-base font-medium border-t border-emerald-400/30 pt-4 inline-block px-4">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;
