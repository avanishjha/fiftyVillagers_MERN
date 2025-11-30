import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { BookOpen, Users, ArrowRight, CheckCircle2, Library } from 'lucide-react';
import TiltedCard from './TiltedCard';

const Programs = () => {
    const [activeCard, setActiveCard] = useState(0);

    const programs = [
        {
            title: "NEET Preparation",
            description: "Comprehensive biology coaching for aspirants, ensuring every student gets the attention they need to crack one of the toughest exams.",
            image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800",
            features: ["Expert Faculty", "Regular Mock Tests", "Doubt Solving"],
            icon: BookOpen,
            color: "from-emerald-600 to-teal-600"
        },
        {
            title: "Hostel Life",
            description: "A home away from home. Our hostel fosters a community of brotherhood where students learn self-reliance and cooperation.",
            image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800",
            features: ["Free Accommodation", "Hygienic Food", "Self-Managed Mess"],
            icon: Users,
            color: "from-teal-600 to-emerald-600"
        },
        {
            title: "Library & Resources",
            description: "24/7 access to a vast collection of books and a quiet environment dedicated to focused self-study and academic growth.",
            image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=800",
            features: ["24/7 Access", "Vast Collection", "Quiet Zone"],
            icon: Library,
            color: "from-green-600 to-teal-600"
        }
    ];

    return (
        <section id="programs" className="bg-gray-50 dark:bg-gray-900 transition-colors duration-500 relative">
            <div className="container mx-auto px-6 py-32">
                <div className="text-center mb-24">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block py-1 px-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm font-bold tracking-widest uppercase mb-4 border border-emerald-200 dark:border-emerald-800"
                    >
                        Our Offerings
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 font-sans tracking-tight"
                    >
                        Holistic Development <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                            Ecosystem
                        </span>
                    </motion.h2>
                </div>

                <div className="relative flex flex-col lg:flex-row gap-20">
                    {/* Sticky Image Section (Desktop) */}
                    <div className="hidden lg:block w-1/2 h-[600px] sticky top-32 rounded-[2.5rem] overflow-hidden shadow-2xl bg-gray-900">
                        {programs.map((program, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: activeCard === index ? 1 : 0 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0 w-full h-full"
                                style={{ pointerEvents: activeCard === index ? 'auto' : 'none' }}
                            >
                                <TiltedCard
                                    imageSrc={program.image}
                                    altText={program.title}
                                    captionText={program.title}
                                    containerHeight="100%"
                                    containerWidth="100%"
                                    imageHeight="100%"
                                    imageWidth="100%"
                                    rotateAmplitude={8}
                                    scaleOnHover={1.05}
                                    showMobileWarning={false}
                                    showTooltip={false}
                                    displayOverlayContent={true}
                                    overlayContent={
                                        <div className="absolute bottom-0 left-0 p-12 w-full">
                                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${program.color} flex items-center justify-center mb-6 shadow-lg`}>
                                                <program.icon className="text-white w-8 h-8" />
                                            </div>
                                            <h3 className="text-4xl font-bold text-white font-sans">{program.title}</h3>
                                        </div>
                                    }
                                />
                            </motion.div>
                        ))}
                    </div>

                    {/* Scrolling Content Section */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-32 pb-32">
                        {programs.map((program, index) => (
                            <Card
                                key={index}
                                program={program}
                                index={index}
                                setActiveCard={setActiveCard}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

const Card = ({ program, index, setActiveCard }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { margin: "-50% 0px -50% 0px" });

    useEffect(() => {
        if (isInView) {
            setActiveCard(index);
        }
    }, [isInView, index, setActiveCard]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 lg:bg-transparent lg:dark:bg-transparent lg:shadow-none lg:border-none"
        >
            {/* Mobile Image (visible only on small screens) */}
            <div className="lg:hidden h-64 rounded-2xl overflow-hidden mb-8 relative">
                <img src={program.image} alt={program.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 font-sans lg:text-4xl">{program.title}</h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                {program.description}
            </p>
            <div className="space-y-4">
                {program.features.map((feature, i) => (
                    <div key={i} className="flex items-center text-gray-700 dark:text-gray-200 text-lg">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500 mr-4 flex-shrink-0" />
                        <span>{feature}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default Programs;
