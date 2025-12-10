"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function IdlePage() {
  const router = useRouter();
  const [showMotion, setShowMotion] = useState(false);
  const [particles, setParticles] = useState<Array<{ x: number, y: number, duration: number, delay: number }>>([]);

  useEffect(() => {
    const timer = setTimeout(() => setShowMotion(true), 1000);

    const newParticles = [...Array(20)].map(() => ({
      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
      y: (typeof window !== 'undefined' ? window.innerHeight : 1000) + 50,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);

    return () => clearTimeout(timer);
  }, []);

  const clothingEmojis = ['👗', '👔', '👖', '🥻', '👕', '👚', '🧥', '👘', '🎽'];

  return (
    <div className="relative h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-orange-600 animate-gradient flex items-center justify-center overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-3 gap-12 p-12">
          {[...Array(9)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: i * 0.1,
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: 1
              }}
              className="aspect-[3/4] bg-white rounded-2xl flex items-center justify-center text-9xl animate-float shadow-2xl"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              {clothingEmojis[i]}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-white rounded-full opacity-30"
            initial={{ x: particle.x, y: particle.y }}
            animate={{ y: -50, x: particle.x + (Math.random() - 0.5) * 100 }}
            transition={{ duration: particle.duration, repeat: Infinity, delay: particle.delay }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center text-white px-12">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-8xl md:text-9xl font-bold mb-8 tracking-tight drop-shadow-2xl"
          style={{ textShadow: '0 0 40px rgba(255,255,255,0.4)' }}
        >
          VIRTUAL FITTING ROOM
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-4xl md:text-5xl mb-16 opacity-90 drop-shadow-lg"
        >
          Try Before You Buy - Powered by AI
        </motion.p>

        {showMotion && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <motion.button
              onClick={() => router.push("/profile")}
              className="bg-white text-purple-900 px-16 py-8 rounded-full text-4xl font-bold shadow-2xl glow"
              whileHover={{ scale: 1.1, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              animate={{ y: [0, -15, 0] }}
              transition={{ y: { repeat: Infinity, duration: 2, ease: "easeInOut" } }}
            >
              👋 Touch to Begin
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Bottom Decorative Bar */}
      <div className="absolute bottom-0 w-full h-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 opacity-70"></div>
    </div>
  );
}
