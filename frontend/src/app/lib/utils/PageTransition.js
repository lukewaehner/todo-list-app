"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const variants = {
  hidden: { opacity: 0 },
  enter: { opacity: 1 },
  exit: { opacity: 0 },
};

const PageTransition = ({ children }) => {
  const pathname = usePathname();
  const motionDivRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (motionDivRef.current) {
        motionDivRef.current.classList.remove("pre-animation");
      }
    }, 50); // Short delay to ensure class is removed after initial render

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        ref={motionDivRef}
        className="pre-animation"
        style={{ position: "absolute", width: "100%" }}
        initial="hidden"
        animate="enter"
        exit="exit"
        variants={variants}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
