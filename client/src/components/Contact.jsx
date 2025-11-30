import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, Twitter, Send, ArrowRight } from 'lucide-react';

const Contact = () => {
    const [formState, setFormState] = useState({ name: '', email: '', message: '' });
    const [focusedField, setFocusedField] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFocus = (field) => setFocusedField(field);
    const handleBlur = () => setFocusedField(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => setIsSubmitting(false), 2000);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10,
            },
        },
    };

    return (
        <section id="contact" className="py-32 relative overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black transition-colors duration-500">
            {/* Animated Background Shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-20 -right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        y: [0, 30, 0],
                        rotate: [0, -5, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute top-1/2 -left-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        x: [0, 40, 0],
                        y: [0, 20, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -bottom-20 right-1/4 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-3xl"
                />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="max-w-7xl mx-auto"
                >
                    {/* Header */}
                    <motion.div variants={itemVariants} className="text-center mb-24">
                        <span className="inline-block py-1 px-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm font-bold tracking-widest uppercase mb-4 border border-emerald-200 dark:border-emerald-800">
                            Get in Touch
                        </span>
                        <h2 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 font-sans tracking-tight">
                            Let's Start a <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                                Conversation
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
                            Have questions about our programs or want to contribute? We're here to listen and collaborate for a better future.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                        {/* Contact Info Side */}
                        <motion.div variants={itemVariants} className="lg:col-span-5 space-y-12">
                            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl p-8 rounded-3xl border border-white/20 dark:border-gray-700/30 shadow-xl">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Contact Information</h3>
                                <div className="space-y-8">
                                    {[
                                        { icon: MapPin, title: "Visit Us", content: "Behind TVS Showroom, Shastri Nagar, Barmer, Rajasthan", color: "text-emerald-500", bg: "bg-emerald-500/10" },
                                        { icon: Phone, title: "Call Us", content: "+91 94139 42612", color: "text-teal-500", bg: "bg-teal-500/10" },
                                        { icon: Mail, title: "Email Us", content: "fiftyvillagersorg@gmail.com", color: "text-green-500", bg: "bg-green-500/10" }
                                    ].map((item, index) => (
                                        <motion.div
                                            key={index}
                                            whileHover={{ x: 10 }}
                                            className="flex items-start group cursor-pointer"
                                        >
                                            <div className={`p-4 rounded-2xl ${item.bg} ${item.color} mr-6 group-hover:scale-110 transition-transform duration-300`}>
                                                <item.icon size={24} />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{item.title}</h4>
                                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">{item.content}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-emerald-900/5 dark:bg-emerald-900/20 p-8 rounded-3xl border border-emerald-100 dark:border-emerald-800/30">
                                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Follow Our Journey</h4>
                                <div className="flex gap-4">
                                    {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                                        <motion.a
                                            key={i}
                                            href="#"
                                            whileHover={{ y: -5, scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="p-4 bg-white dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-600 shadow-md transition-all border border-gray-100 dark:border-gray-700"
                                        >
                                            <Icon size={20} />
                                        </motion.a>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Form Side */}
                        <motion.div variants={itemVariants} className="lg:col-span-7">
                            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-110" />

                                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="relative group/input">
                                            <label className={`absolute left-0 transition-all duration-300 ${focusedField === 'name' || formState.name ? '-top-6 text-xs text-emerald-600 dark:text-emerald-400 font-bold' : 'top-3 text-gray-500 dark:text-gray-400'}`}>
                                                Your Name
                                            </label>
                                            <input
                                                type="text"
                                                onFocus={() => handleFocus('name')}
                                                onBlur={handleBlur}
                                                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                                className="w-full bg-transparent border-b-2 border-gray-200 dark:border-gray-700 py-3 text-gray-900 dark:text-white focus:border-emerald-500 focus:outline-none transition-colors text-lg"
                                            />
                                            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover/input:w-full" />
                                        </div>
                                        <div className="relative group/input">
                                            <label className={`absolute left-0 transition-all duration-300 ${focusedField === 'email' || formState.email ? '-top-6 text-xs text-emerald-600 dark:text-emerald-400 font-bold' : 'top-3 text-gray-500 dark:text-gray-400'}`}>
                                                Your Email
                                            </label>
                                            <input
                                                type="email"
                                                onFocus={() => handleFocus('email')}
                                                onBlur={handleBlur}
                                                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                                className="w-full bg-transparent border-b-2 border-gray-200 dark:border-gray-700 py-3 text-gray-900 dark:text-white focus:border-emerald-500 focus:outline-none transition-colors text-lg"
                                            />
                                            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover/input:w-full" />
                                        </div>
                                    </div>

                                    <div className="relative group/input">
                                        <label className={`absolute left-0 transition-all duration-300 ${focusedField === 'message' || formState.message ? '-top-6 text-xs text-emerald-600 dark:text-emerald-400 font-bold' : 'top-3 text-gray-500 dark:text-gray-400'}`}>
                                            Your Message
                                        </label>
                                        <textarea
                                            rows="4"
                                            onFocus={() => handleFocus('message')}
                                            onBlur={handleBlur}
                                            onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                            className="w-full bg-transparent border-b-2 border-gray-200 dark:border-gray-700 py-3 text-gray-900 dark:text-white focus:border-emerald-500 focus:outline-none transition-colors text-lg resize-none"
                                        ></textarea>
                                        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover/input:w-full" />
                                    </div>

                                    <div className="pt-4">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 text-lg group/btn overflow-hidden relative"
                                        >
                                            <span className="relative z-10 flex items-center gap-2">
                                                {isSubmitting ? 'Sending...' : 'Send Message'}
                                                {!isSubmitting && <Send size={20} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />}
                                            </span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-in-out" />
                                        </motion.button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Contact;
