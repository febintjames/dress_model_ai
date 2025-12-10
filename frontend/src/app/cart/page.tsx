"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ShoppingCart, Package, Home, CreditCard, Trash2 } from "lucide-react";
import { useKioskStore } from "@/lib/store";

export default function CartPage() {
    const router = useRouter();
    const { cart, removeFromCart } = useKioskStore();
    const total = cart.reduce((sum: number, item: any) => sum + item.price, 0);
    const [particles, setParticles] = useState<Array<{ x: number, y: number, duration: number, delay: number }>>([]);

    useEffect(() => {
        const newParticles = [...Array(15)].map(() => ({
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: (typeof window !== 'undefined' ? window.innerHeight : 1000) + 50,
            duration: Math.random() * 10 + 10,
            delay: Math.random() * 5
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div className="h-screen bg-gradient-to-br from-rose-900 via-pink-800 to-purple-900 animate-gradient overflow-auto relative">
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

            <div className="max-w-5xl mx-auto p-12 relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-6xl font-bold text-white mb-10 drop-shadow-lg"
                    style={{ textShadow: '0 0 30px rgba(255,255,255,0.3)' }}
                >
                    Your Cart ({cart.length} items)
                </motion.h2>

                {cart.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-16 text-center"
                    >
                        <ShoppingCart className="w-32 h-32 text-pink-300 mx-auto mb-6" />
                        <p className="text-pink-200 text-3xl mb-8">Your cart is empty</p>
                        <motion.button
                            onClick={() => router.push('/selection')}
                            whileHover={{ scale: 1.05 }}
                            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-12 py-5 rounded-xl text-2xl font-bold shadow-lg shadow-pink-500/50"
                        >
                            Continue Shopping
                        </motion.button>
                    </motion.div>
                ) : (
                    <>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8 mb-8"
                        >
                            {cart.map((item: any, index: number) => (
                                <motion.div
                                    key={item.id || index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center gap-6 py-6 border-b border-white/10 last:border-b-0"
                                >
                                    <div style={{ fontSize: '5rem' }}>{item.image}</div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-3xl text-white">{item.name}</h3>
                                        <p className="text-pink-200 text-xl">{item.category}</p>
                                    </div>
                                    <p className="text-4xl font-bold text-pink-300">₹{item.price}</p>
                                    <motion.button
                                        onClick={() => removeFromCart(item.id)}
                                        whileHover={{ scale: 1.1 }}
                                        className="bg-red-500/20 text-red-400 p-4 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                    >
                                        <Trash2 className="w-8 h-8" />
                                    </motion.button>
                                </motion.div>
                            ))}

                            <div className="mt-8 pt-8 border-t-2 border-white/20">
                                <div className="flex justify-between items-center text-4xl font-bold">
                                    <span className="text-white">Total</span>
                                    <span className="text-pink-300">₹{total}</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8 mb-8"
                        >
                            <h3 className="text-3xl font-bold text-white mb-6">Fulfillment Options</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-pink-500/30 border-2 border-pink-400 text-white py-8 rounded-2xl font-bold text-2xl"
                                >
                                    <Package className="w-12 h-12 mx-auto mb-3" />
                                    Pick Up Now
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-white/5 border-2 border-white/20 text-white py-8 rounded-2xl font-semibold text-2xl hover:border-pink-400"
                                >
                                    <Home className="w-12 h-12 mx-auto mb-3" />
                                    Home Delivery
                                </motion.button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8"
                        >
                            <h3 className="text-3xl font-bold text-white mb-6">Payment Method</h3>
                            <div className="space-y-4">
                                <motion.button
                                    onClick={() => router.push('/checkout')}
                                    whileHover={{ scale: 1.02 }}
                                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-6 rounded-2xl text-2xl font-bold flex items-center justify-center gap-4 shadow-lg shadow-pink-500/50 glow"
                                >
                                    <CreditCard className="w-8 h-8" />
                                    Pay Now (UPI / Card)
                                </motion.button>
                                <motion.button
                                    onClick={() => router.push('/checkout')}
                                    whileHover={{ scale: 1.02 }}
                                    className="w-full bg-white/10 border-2 border-white/20 text-white py-6 rounded-2xl text-2xl font-semibold hover:border-pink-400"
                                >
                                    Pay at Counter
                                </motion.button>
                            </div>
                        </motion.div>
                    </>
                )}
            </div>
        </div>
    );
}
