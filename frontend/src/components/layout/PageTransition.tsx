"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

// Optimized smooth transition effects for each page
const transitionEffects = {
    // Idle page - Smooth fade with gentle scale
    "/": {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 1.05 },
        transition: { duration: 0.3, ease: "easeOut" as const },
    },
    // Profile page - Slide up smoothly
    "/profile": {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -30 },
        transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
    // Selection page - Zoom in smoothly
    "/selection": {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 1.1 },
        transition: { duration: 0.3, ease: "easeInOut" as const },
    },
    // Privacy page - Slide from left
    "/privacy": {
        initial: { opacity: 0, x: -60 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 60 },
        transition: { duration: 0.3, ease: "easeOut" as const },
    },
    // Scan page - Scale reveal
    "/scan": {
        initial: { opacity: 0, scale: 0.85 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 },
        transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] as const },
    },
    // Trial page - Slide from right
    "/trial": {
        initial: { opacity: 0, x: 80 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -80 },
        transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
    // Cart page - Slide up with scale
    "/cart": {
        initial: { opacity: 0, y: 40, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -40, scale: 0.98 },
        transition: { duration: 0.3, ease: "easeOut" as const },
    },
    // Checkout page - Fade with gentle scale
    "/checkout": {
        initial: { opacity: 0, scale: 0.92 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 1.08 },
        transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const },
    },
};

// Default fallback transition
const defaultTransition = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.25, ease: "easeOut" as const },
};

export default function PageTransition({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // Get the transition effect for the current route
    const effect = transitionEffects[pathname as keyof typeof transitionEffects] || defaultTransition;

    return (
        <AnimatePresence mode="sync">
            <motion.div
                key={pathname}
                initial={effect.initial}
                animate={effect.animate}
                exit={effect.exit}
                transition={effect.transition}
                className="w-full h-full absolute inset-0"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
