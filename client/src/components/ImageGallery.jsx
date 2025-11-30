import React from 'react';
import { motion } from 'framer-motion';
import MagneticButton from './MagneticButton';

const images = [
    {
        src: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800",
        className: "md:col-span-2 md:row-span-2",
        title: "Community Learning"
    },
    {
        src: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600",
        className: "md:col-span-1 md:row-span-1",
        title: "Student Success"
    },
    {
        src: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=600",
        className: "md:col-span-1 md:row-span-1",
        title: "Mentorship"
    },
    {
        src: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800",
        className: "md:col-span-2 md:row-span-1",
        title: "Workshops"
    },
    {
        src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800",
        className: "md:col-span-2 md:row-span-1",
        title: "Field Trips"
    },
    {
        src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800",
        className: "md:col-span-2 md:row-span-1",
        title: "Graduation"
    },
];

const ImageGallery = () => {
    return (
        <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-500">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white font-sans">
                        Life at Fifty Villagers
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-body text-lg">
                        Glimpses of our students, activities, and community service initiatives.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[200px] gap-4">
                    {images.map((img, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`relative group overflow-hidden rounded-3xl shadow-lg ${img.className}`}
                        >
                            <img
                                src={img.src}
                                alt={img.title}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                <h3 className="text-white font-bold text-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    {img.title}
                                </h3>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12 flex flex-col sm:flex-row justify-center gap-6">
                    <MagneticButton>
                        Visit Photo Gallery 📸
                    </MagneticButton>
                    <MagneticButton>
                        Visit Video Gallery 📹
                    </MagneticButton>
                </div>
            </div>
        </section>
    );
};

export default ImageGallery;
