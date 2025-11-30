import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ParallaxSection = ({
    backgroundImage,
    videoSrc,
    children,
    height = "100vh",
    overlayOpacity = 0.5
}) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

    return (
        <section
            ref={ref}
            className={`relative overflow-hidden flex items-center justify-center bg-black ${height === "100vh" ? "min-h-screen" : ""}`}
            style={{ minHeight: height === "100vh" ? undefined : height }}
        >
            <motion.div
                style={{ y }}
                className="absolute inset-0 z-0"
            >
                {videoSrc ? (
                    <video
                        key={videoSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                    >
                        <source src={videoSrc} type="video/mp4" />
                    </video>
                ) : (
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${backgroundImage})` }}
                    />
                )}

                <div
                    className="absolute inset-0 bg-black"
                    style={{ opacity: overlayOpacity }}
                />
            </motion.div>

            <div className="relative z-10 container mx-auto px-6">
                {children}
            </div>
        </section>
    );
};

export default ParallaxSection;
