"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useKioskStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Info } from "lucide-react";

const GENDERS = ["Male", "Female", "Neutral"];
const AGES = ["Child", "Teen", "Adult", "Senior"];
const BODYTYPES = ["Slim", "Regular", "Plus", "Athletic"];
const SKINTONES = ["Fair", "Medium", "Olive", "Dark"];

export default function ProfilePage() {
    const router = useRouter();
    const { updateProfile, accessibilityMode, toggleAccessibility } = useKioskStore();

    const [selectedGender, setSelectedGender] = useState<string | null>(null);
    const [selectedAge, setSelectedAge] = useState<string | null>(null);
    const [selectedBodyType, setSelectedBodyType] = useState<string | null>(null);
    const [selectedSkin, setSelectedSkin] = useState<string | null>(null);
    const [particles, setParticles] = useState<Array<{ x: number, y: number, duration: number, delay: number }>>([]);

    const canProceed = selectedGender && selectedAge && selectedBodyType && selectedSkin;

    useEffect(() => {
        const newParticles = [...Array(15)].map(() => ({
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: (typeof window !== 'undefined' ? window.innerHeight : 1000) + 50,
            duration: Math.random() * 10 + 10,
            delay: Math.random() * 5
        }));
        setParticles(newParticles);
    }, []);

    const handleNext = () => {
        if (canProceed) {
            updateProfile({
                gender: selectedGender?.toLowerCase() as any,
                ageRange: selectedAge,
                skinTone: selectedSkin
            });
            router.push("/selection");
        }
    };

    return (
        <div className="h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-indigo-900 animate-gradient p-12 overflow-auto relative">
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

            <div className="max-w-6xl mx-auto relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-6xl font-bold text-white mb-10 drop-shadow-lg"
                    style={{ textShadow: '0 0 30px rgba(255,255,255,0.3)' }}
                >
                    Welcome! Let's Get Started
                </motion.h2>

                {!accessibilityMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 mb-10"
                    >
                        <div className="flex items-start gap-6">
                            <Info className="w-12 h-12 text-blue-300 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-3xl font-semibold text-white mb-3">Need Accessibility Mode?</h3>
                                <p className="text-blue-200 mb-6 text-xl">UI will adjust for easier reach and better visibility</p>
                                <button
                                    onClick={toggleAccessibility}
                                    className="bg-blue-500 text-white px-8 py-4 rounded-xl text-xl hover:bg-blue-600 transition-colors shadow-lg"
                                >
                                    Enable Accessibility Mode
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-10"
                >
                    <h3 className="text-4xl font-semibold text-white mb-8">Choose Your Avatar Baseline</h3>

                    <div className="space-y-8">
                        {/* Gender */}
                        <div>
                            <label className="block text-2xl font-medium text-blue-200 mb-4">Gender</label>
                            <div className="grid grid-cols-3 gap-4">
                                {GENDERS.map(option => (
                                    <motion.button
                                        key={option}
                                        onClick={() => setSelectedGender(option)}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        className={`px-6 py-5 rounded-xl border-2 text-2xl font-medium transition-all ${selectedGender === option
                                            ? 'bg-purple-500 text-white border-purple-400 shadow-lg shadow-purple-500/50'
                                            : 'bg-white/10 text-white border-white/20 hover:border-purple-400'
                                            }`}
                                    >
                                        {option}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Age */}
                        <div>
                            <label className="block text-2xl font-medium text-blue-200 mb-4">Age</label>
                            <div className="grid grid-cols-4 gap-4">
                                {AGES.map(option => (
                                    <motion.button
                                        key={option}
                                        onClick={() => setSelectedAge(option)}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        className={`px-6 py-5 rounded-xl border-2 text-2xl font-medium transition-all ${selectedAge === option
                                            ? 'bg-purple-500 text-white border-purple-400 shadow-lg shadow-purple-500/50'
                                            : 'bg-white/10 text-white border-white/20 hover:border-purple-400'
                                            }`}
                                    >
                                        {option}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Body Type */}
                        <div>
                            <label className="block text-2xl font-medium text-blue-200 mb-4">Body Type</label>
                            <div className="grid grid-cols-4 gap-4">
                                {BODYTYPES.map(option => (
                                    <motion.button
                                        key={option}
                                        onClick={() => setSelectedBodyType(option)}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        className={`px-6 py-5 rounded-xl border-2 text-2xl font-medium transition-all ${selectedBodyType === option
                                            ? 'bg-purple-500 text-white border-purple-400 shadow-lg shadow-purple-500/50'
                                            : 'bg-white/10 text-white border-white/20 hover:border-purple-400'
                                            }`}
                                    >
                                        {option}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Skin Tone */}
                        <div>
                            <label className="block text-2xl font-medium text-blue-200 mb-4">Skin Tone</label>
                            <div className="grid grid-cols-4 gap-4">
                                {SKINTONES.map(option => (
                                    <motion.button
                                        key={option}
                                        onClick={() => setSelectedSkin(option)}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        className={`px-6 py-5 rounded-xl border-2 text-2xl font-medium transition-all ${selectedSkin === option
                                            ? 'bg-purple-500 text-white border-purple-400 shadow-lg shadow-purple-500/50'
                                            : 'bg-white/10 text-white border-white/20 hover:border-purple-400'
                                            }`}
                                    >
                                        {option}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <motion.button
                        onClick={handleNext}
                        disabled={!canProceed}
                        whileHover={{ scale: canProceed ? 1.02 : 1 }}
                        whileTap={{ scale: canProceed ? 0.98 : 1 }}
                        className="mt-10 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-6 rounded-2xl text-3xl font-bold hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all glow"
                    >
                        Continue to Product Selection →
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
}
