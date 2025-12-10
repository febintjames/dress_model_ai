"use client";

import { useKioskStore } from "@/lib/store";
import { motion } from "framer-motion";
import { Accessibility } from "lucide-react";

export default function AccessibilityToggle() {
    const { accessibilityMode, toggleAccessibility } = useKioskStore();

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleAccessibility}
            className={`fixed z-50 p-4 rounded-full border backdrop-blur-md transition-all duration-300 shadow-xl ${accessibilityMode
                    ? "bottom-10 right-10 bg-accent text-white border-accent"
                    : "top-10 right-10 bg-white/10 text-white border-white/20 hover:bg-white/20"
                }`}
            aria-label="Toggle Accessibility Mode"
        >
            <Accessibility size={24} />
        </motion.button>
    );
}
