import React from "react";
import { motion } from "framer-motion";

import { useMemo } from "react";

const generateRandomPositions = (count: number) => {
  return [...Array(count)].map(() => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
  }));
};

const MovingCirclesBackground: React.FC = () => {
  const animate = useMemo(() => generateRandomPositions(12), []);
  const positions = useMemo(() => generateRandomPositions(12), []);

  return (
    <div className="relative w-full h-full bg-[#1C4043] overflow-hidden z-index-0">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-96 h-96 bg-[#F2907A] rounded-full opacity-50"
          style={{ filter: "blur(10px)" }}
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

export default MovingCirclesBackground;
