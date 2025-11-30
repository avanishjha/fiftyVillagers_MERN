import React from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

function ElegantShape({
    className,
    delay = 0,
    width = 400,
    height = 100,
    rotate = 0,
    gradient = "from-white/[0.08]",
}) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: -150,
                rotate: rotate - 15,
            }}
            animate={{
                opacity: 1,
                y: 0,
                rotate: rotate,
            }}
            transition={{
                duration: 2.4,
                delay,
                ease: [0.23, 0.86, 0.39, 0.96],
                opacity: { duration: 1.2 },
            }}
            className={cn("absolute", className)}
        >
            <motion.div
                animate={{
                    y: [0, 15, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
                style={{
                    width,
                    height,
                }}
                className="relative"
            >
                <div
                    className={cn(
                        "absolute inset-0 rounded-full",
                        "bg-gradient-to-r to-transparent",
                        gradient,
                        "backdrop-blur-[2px] border-2 border-black/[0.15] dark:border-white/[0.15]",
                        "shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
                        "after:absolute after:inset-0 after:rounded-full",
                        "after:bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.2),transparent_70%)] dark:after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
                    )}
                />
            </motion.div>
        </motion.div>
    );
}

export default function ShapeBackground({ children }) {
    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white dark:bg-[#030303]">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.05] via-transparent to-teal-500/[0.05] blur-3xl" />

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <ElegantShape
                    delay={0.3}
                    width={900}
                    height={200}
                    rotate={12}
                    gradient="from-emerald-500/[0.15]"
                    className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
                />
                <ElegantShape
                    delay={0.5}
                    width={700}
                    height={180}
                    rotate={-15}
                    gradient="from-teal-500/[0.15]"
                    className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
                />
                <ElegantShape
                    delay={0.4}
                    width={500}
                    height={120}
                    rotate={-8}
                    gradient="from-green-500/[0.15]"
                    className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
                />
                <ElegantShape
                    delay={0.6}
                    width={400}
                    height={100}
                    rotate={20}
                    gradient="from-lime-500/[0.15]"
                    className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
                />
                <ElegantShape
                    delay={0.7}
                    width={300}
                    height={80}
                    rotate={-25}
                    gradient="from-cyan-500/[0.15]"
                    className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
                />
                {/* New Shapes */}
                <ElegantShape
                    delay={0.8}
                    width={350}
                    height={90}
                    rotate={15}
                    gradient="from-emerald-400/[0.15]"
                    className="right-[30%] md:right-[35%] bottom-[15%] md:bottom-[20%]"
                />
                <ElegantShape
                    delay={0.9}
                    width={250}
                    height={70}
                    rotate={-10}
                    gradient="from-teal-400/[0.15]"
                    className="left-[40%] md:left-[45%] top-[40%] md:top-[45%]"
                />
                <ElegantShape
                    delay={1.0}
                    width={450}
                    height={110}
                    rotate={30}
                    gradient="from-green-400/[0.15]"
                    className="right-[5%] md:right-[10%] top-[40%] md:top-[45%]"
                />
            </div>

            <div className="relative z-10 container mx-auto px-4 md:px-6">
                {children}
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/80 dark:from-[#030303] dark:via-transparent dark:to-[#030303]/80 pointer-events-none" />
        </div>
    );
}
