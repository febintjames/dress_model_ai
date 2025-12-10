"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

export default function CheckoutPage() {
    const router = useRouter();
    const [particles, setParticles] = useState<Array<{ x: number, y: number, duration: number, delay: number }>>([]);
    const [confetti, setConfetti] = useState<Array<{ x: number, color: string, duration: number, delay: number }>>([]);

    useEffect(() => {
        // Initialize particles
        const newParticles = [...Array(20)].map(() => ({
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: (typeof window !== 'undefined' ? window.innerHeight : 1000) + 50,
            duration: Math.random() * 10 + 10,
            delay: Math.random() * 5
        }));
        setParticles(newParticles);

        // Initialize confetti
        const colors = ['#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#fbbf24', '#f472b6'];
        const newConfetti = [...Array(30)].map((_, i) => ({
            x: Math.random() * 100,
            color: colors[i % colors.length],
            duration: Math.random() * 3 + 2,
            delay: Math.random() * 2
        }));
        setConfetti(newConfetti);

        // Auto-redirect after 5 seconds
        const timer = setTimeout(() => router.push('/'), 5000);
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 animate-gradient flex items-center justify-center relative overflow-hidden">
            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {particles.map((particle, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-3 h-3 bg-white rounded-full opacity-20"
                        initial={{ x: particle.x, y: particle.y }}
                        animate={{ y: -50, x: particle.x + (Math.random() - 0.5) * 100 }}
                        transition={{ duration: particle.duration, repeat: Infinity, delay: particle.delay }}
                    />
                ))}
            </div>

            {/* Celebration confetti */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {confetti.map((item, i) => (
                    <motion.div
                        key={`confetti-${i}`}
                        className="absolute w-4 h-4 rounded-full"
                        style={{
                            backgroundColor: item.color,
                            left: `${item.x}%`
                        }}
                        initial={{ y: -20, opacity: 1, rotate: 0 }}
                        animate={{
                            y: typeof window !== 'undefined' ? window.innerHeight : 1000,
                            opacity: 0,
                            rotate: 360
                        }}
                        transition={{
                            duration: item.duration,
                            delay: item.delay,
                            repeat: Infinity
                        }}
                    />
                ))}
            </div>

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-16 max-w-4xl text-center relative z-10"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-48 h-48 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-lg shadow-emerald-500/50"
                >
                    <Check className="w-28 h-28 text-white" />
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-6xl font-bold text-white mb-6"
                    style={{ textShadow: '0 0 30px rgba(255,255,255,0.3)' }}
                >
                    Order Successful!
                </motion.h2>
                <p className="text-emerald-200 text-3xl mb-10">Thank you for shopping with us</p>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white/10 rounded-2xl p-8 mb-10"
                >
                    <div className="grid grid-cols-2 gap-6 text-left">
                        <div>
                            <p className="text-xl text-emerald-300 mb-2">Order ID</p>
                            <p className="font-bold text-3xl text-white">#VFR{Math.floor(Math.random() * 10000)}</p>
                        </div>
                        <div>
                            <p className="text-xl text-emerald-300 mb-2">Items</p>
                            <p className="font-bold text-3xl text-white">1</p>
                        </div>
                        <div>
                            <p className="text-xl text-emerald-300 mb-2">Total Amount</p>
                            <p className="font-bold text-3xl text-green-300">₹2499</p>
                        </div>
                        <div>
                            <p className="text-xl text-emerald-300 mb-2">Status</p>
                            <p className="font-bold text-3xl text-emerald-400">Confirmed ✓</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-cyan-500/20 border border-cyan-400/30 rounded-2xl p-8 mb-10"
                >
                    <p className="text-cyan-200 font-bold text-2xl mb-3">🔒 Privacy Notice</p>
                    <p className="text-cyan-300 text-xl">Your body scan data has been permanently deleted from our system</p>
                </motion.div>

                <motion.button
                    onClick={() => router.push('/')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-6 rounded-2xl text-3xl font-bold shadow-lg shadow-emerald-500/50 glow-green"
                >
                    Start New Session
                </motion.button>
            </motion.div>
        </div>
    );
}
