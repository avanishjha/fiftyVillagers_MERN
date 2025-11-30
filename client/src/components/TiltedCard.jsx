import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const TiltedCard = ({
    imageSrc,
    altText = "Tilted card image",
    captionText = "",
    containerHeight = "300px",
    containerWidth = "100%",
    imageHeight = "300px",
    imageWidth = "300px",
    rotateAmplitude = 12,
    scaleOnHover = 1.1,
    showMobileWarning = false,
    showTooltip = true,
    displayOverlayContent = false,
    overlayContent = null,
}) => {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseY = useSpring(y, { stiffness: 300, damping: 30 });

    const rotateX = useTransform(
        mouseY,
        [-0.5, 0.5],
        [rotateAmplitude, -rotateAmplitude]
    );
    const rotateY = useTransform(
        mouseX,
        [-0.5, 0.5],
        [-rotateAmplitude, rotateAmplitude]
    );

    const handleMouseMove = (e) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const mouseXFromCenter = e.clientX - rect.left - width / 2;
        const mouseYFromCenter = e.clientY - rect.top - height / 2;

        x.set(mouseXFromCenter / width);
        y.set(mouseYFromCenter / height);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <div
            ref={ref}
            className="tilted-card-container relative flex items-center justify-center"
            style={{
                height: containerHeight,
                width: containerWidth,
                perspective: "1000px",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                className="tilted-card-inner relative z-10"
                style={{
                    width: imageWidth,
                    height: imageHeight,
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                whileHover={{ scale: scaleOnHover }}
            >
                <motion.img
                    src={imageSrc}
                    alt={altText}
                    className="absolute inset-0 w-full h-full object-cover rounded-xl shadow-2xl"
                    style={{
                        transform: "translateZ(0px)",
                    }}
                />

                {displayOverlayContent && overlayContent && (
                    <motion.div
                        className="absolute inset-0 z-20 flex items-end p-6"
                        style={{
                            transform: "translateZ(50px)",
                        }}
                    >
                        {overlayContent}
                    </motion.div>
                )}

                {showTooltip && captionText && (
                    <motion.div
                        className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white text-black px-3 py-1 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap"
                        style={{ transform: "translateZ(80px) translateX(-50%)" }}
                    >
                        {captionText}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default TiltedCard;
