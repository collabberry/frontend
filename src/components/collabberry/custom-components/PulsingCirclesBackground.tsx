import React from "react";
import { motion } from "framer-motion";

import { useMemo } from "react";

const generateRandomPositions = (count: number) => {
    return [...Array(count)].map(() => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
    }));
};
const PulsingCirclesBackground: React.FC = () => {

    const pulseAnimation = {
        scale: [1, 1.5, 1],
        opacity: [0.5, 1, 0.5],
    };

    const animations = (x: number, y: number) => ({
        ...pulseAnimation,
        x: [x, Math.random() * window.innerWidth],
        y: [y, Math.random() * window.innerHeight],
    });

    const positions = useMemo(() => generateRandomPositions(12), []);
    const animate = useMemo(() => positions.map(pos => animations(pos.x, pos.y)), []);


    return (
        <div className="relative w-full h-full bg-[#1C4043] overflow-hidden z-index-0">
            {[...Array(12)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-48 h-48 bg-[#F2907A] rounded-full opacity-50"
                    style={{ filter: "blur(50px)" }}
                    initial={positions[i]}
                    animate={animate[i]}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
};

export default PulsingCirclesBackground;
