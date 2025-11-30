import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
    return (
        <section id="about" className="relative py-20 bg-white dark:bg-gray-900 overflow-hidden transition-colors duration-500">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    {/* Image Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full lg:w-1/2 relative"
                    >
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                            <img
                                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=2070"
                                alt="Students studying"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-emerald-600/20 mix-blend-multiply" />
                        </div>
                        {/* Decorative Element */}
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" />
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" />
                    </motion.div>

                    {/* Text Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="w-full lg:w-1/2"
                    >
                        <h2 className="text-emerald-600 dark:text-emerald-400 font-bold tracking-widest uppercase mb-4 text-sm">About Us</h2>
                        <h3 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 dark:text-white leading-tight">
                            Illuminating Paths for <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                                Future Doctors
                            </span>
                        </h3>

                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                            Fifty Villagers Seva Sansthan is a beacon of hope in Barmer, founded by doctors and guided by teachers.
                            We are dedicated to providing free biology education to bright students from economically weaker backgrounds.
                        </p>

                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                            Our mission extends beyond academics. We foster holistic development through health awareness,
                            environmental conservation, and instilling strong moral values (Sanskar).
                        </p>

                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { label: "Founded by", value: "Dr. Bharat Sahran" },
                                { label: "Guided by", value: "Teachers" },
                                { label: "Vision", value: "Dr. APJ Abdul Kalam" },
                                { label: "Goal", value: "Service" }
                            ].map((item, index) => (
                                <div key={index} className="border-l-4 border-emerald-500 pl-4">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 uppercase">{item.label}</p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default About;
