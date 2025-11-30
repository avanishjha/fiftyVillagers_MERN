import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ParallaxSection from './ParallaxSection';

const MagneticButton = ({ children, className, variant = 'primary' }) => {
    const ref = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = (e) => {
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
    };

    const reset = () => {
        setPosition({ x: 0, y: 0 });
    };

    const { x, y } = position;

    return (
        <motion.button
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            animate={{ x, y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            className={className}
        >
            {children}
        </motion.button>
    );
};

const Hero = () => {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.3 },
        },
    };

    const item = {
        hidden: { y: 30, opacity: 0, filter: "blur(10px)" },
        show: { y: 0, opacity: 1, filter: "blur(0px)", transition: { duration: 0.8, ease: "easeOut" } },
    };

    return (
        <ParallaxSection
            videoSrc="/hero-video.mp4"
            overlayOpacity={0.6}
        >
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="max-w-5xl mx-auto text-center text-white mt-12 md:mt-20"
            >
                <motion.h2 variants={item} className="text-emerald-400 font-bold tracking-[0.3em] uppercase mb-4 md:mb-6 text-xs md:text-base font-sans">
                    Service Organization
                </motion.h2>

                <motion.h1
                    variants={item}
                    className="text-4xl md:text-6xl lg:text-8xl font-extrabold leading-tight tracking-tighter mb-6 md:mb-8 font-sans"
                >
                    Empowering Communities,<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                        Building Futures!
                    </span>
                </motion.h1>

                <motion.p variants={item} className="text-lg md:text-3xl text-gray-200 mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed font-light font-body px-4">
                    We uplift needy and underprivileged students, helping them achieve dreams they couldn’t reach alone.
                </motion.p>

                <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center px-4">
                    <MagneticButton className="px-8 py-4 md:px-10 md:py-5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-full transition-all shadow-2xl text-base md:text-lg font-sans">
                        Donate Now
                    </MagneticButton>
                    <MagneticButton className="px-8 py-4 md:px-10 md:py-5 bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white hover:text-black font-bold rounded-full transition-all text-base md:text-lg font-sans">
                        Our Story
                    </MagneticButton>
                </motion.div>
            </motion.div>
        </ParallaxSection>
    );
};

export default Hero;
