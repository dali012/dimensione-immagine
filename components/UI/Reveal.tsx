import React, { useEffect, useMemo, useRef } from "react";
import { motion, useInView, useAnimation, type Variants } from "framer-motion";

interface RevealProps {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
  fullHeight?: boolean;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  width = "fit-content",
  delay = 0.25,
  duration = 0.5,
  direction = "up",
  className = "",
  fullHeight = false,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView]);

  const variants = useMemo((): Variants => {
    const hidden: { opacity: number; x?: number; y?: number } = { opacity: 0 };
    const visible: { opacity: number; x?: number; y?: number } = {
      opacity: 1,
      x: 0,
      y: 0,
    };

    switch (direction) {
      case "up":
        hidden.y = 75;
        break;
      case "down":
        hidden.y = -75;
        break;
      case "left":
        hidden.x = 75;
        break;
      case "right":
        hidden.x = -75;
        break;
      case "none":
        break;
    }

    return {
      hidden,
      visible: {
        ...visible,
        transition: { duration, delay, ease: "easeOut" as const },
      },
    };
  }, [direction, duration, delay]);

  return (
    <div
      ref={ref}
      style={{ position: "relative", width, overflow: "hidden" }}
      className={`${className} ${fullHeight ? "h-full" : ""}`}
    >
      <motion.div
        variants={variants}
        initial="hidden"
        animate={mainControls}
        className={fullHeight ? "h-full" : ""}
      >
        {children}
      </motion.div>
    </div>
  );
};
