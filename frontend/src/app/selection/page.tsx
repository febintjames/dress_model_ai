"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Shirt, Scan } from "lucide-react";
import { useKioskStore } from "@/lib/store";

type GenderType = 'male' | 'female' | 'unisex';

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    image: string;
    sizes: string[];
    gender: GenderType;
}

// All products with gender
const ALL_PRODUCTS: Product[] = [
    // Female Products
    { id: 1, name: 'Summer Floral Dress', category: 'Dresses', price: 2499, image: '👗', sizes: ['S', 'M', 'L', 'XL'], gender: 'female' },
    { id: 2, name: 'Navy Evening Gown', category: 'Dresses', price: 3499, image: '👗', sizes: ['S', 'M', 'L'], gender: 'female' },
    { id: 3, name: 'Pink Blouse', category: 'Tops', price: 999, image: '👚', sizes: ['S', 'M', 'L'], gender: 'female' },
    { id: 4, name: 'Pink High Heels', category: 'Shoes', price: 2499, image: '👠', sizes: ['36', '37', '38', '39'], gender: 'female' },
    { id: 5, name: 'Beige Handbag', category: 'Accessories', price: 2199, image: '👜', sizes: ['One Size'], gender: 'female' },

    // Male Products
    { id: 6, name: 'Orange Polo Shirt', category: 'Tops', price: 999, image: '👕', sizes: ['S', 'M', 'L', 'XL'], gender: 'male' },
    { id: 7, name: 'White Formal Shirt', category: 'Tops', price: 1199, image: '👔', sizes: ['S', 'M', 'L', 'XL'], gender: 'male' },
    { id: 8, name: 'Navy Chinos', category: 'Bottoms', price: 1899, image: '👖', sizes: ['28', '30', '32', '34'], gender: 'male' },
    { id: 9, name: 'Black Jeans', category: 'Bottoms', price: 1999, image: '👖', sizes: ['28', '30', '32', '34'], gender: 'male' },
    { id: 10, name: 'White Sneakers', category: 'Shoes', price: 1299, image: '👟', sizes: ['40', '41', '42', '43'], gender: 'male' },
    { id: 11, name: 'Brown Loafers', category: 'Shoes', price: 2499, image: '👞', sizes: ['40', '41', '42', '43'], gender: 'male' },

    // Unisex Products
    { id: 12, name: 'Black Sunglasses', category: 'Accessories', price: 1499, image: '🕶️', sizes: ['One Size'], gender: 'unisex' },
    { id: 13, name: 'Brown Leather Belt', category: 'Accessories', price: 799, image: '🎗️', sizes: ['M', 'L', 'XL'], gender: 'unisex' },
];

export default function SelectionPage() {
    const router = useRouter();
    const { userProfile, setSelectedProduct } = useKioskStore();
    const [mode, setMode] = useState<'browse' | 'scan'>('browse');
    const [particles, setParticles] = useState<Array<{ x: number, y: number, duration: number, delay: number }>>([]);

    // Get gender from store and filter products
    const userGender = userProfile?.gender?.toLowerCase() || 'male';
    const PRODUCTS = ALL_PRODUCTS.filter(p => p.gender === userGender || p.gender === 'unisex');

    useEffect(() => {
        const newParticles = [...Array(15)].map(() => ({
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: (typeof window !== 'undefined' ? window.innerHeight : 1000) + 50,
            duration: Math.random() * 10 + 10,
            delay: Math.random() * 5
        }));
        setParticles(newParticles);
    }, []);

    const handleProductSelect = (product: Product) => {
        // Save selected product to store so Trial page can use it
        setSelectedProduct(product);
        router.push("/trial");
    };

    return (
        <div className="h-screen bg-gradient-to-br from-teal-900 via-cyan-800 to-blue-900 animate-gradient flex flex-col relative overflow-hidden">
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

            {/* Header */}
            <div className="bg-white/10 backdrop-blur-md border-b border-white/20 px-12 py-6 flex items-center justify-between relative z-10">
                <h2 className="text-5xl font-bold text-white drop-shadow-lg">Select Your Style</h2>
                <div className="flex gap-6">
                    <motion.button
                        onClick={() => setMode('browse')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex items-center gap-3 px-8 py-4 rounded-xl text-xl font-semibold transition-all ${mode === 'browse'
                            ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/50'
                            : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                    >
                        <Shirt className="w-7 h-7" />
                        Browse Catalog
                    </motion.button>
                    <motion.button
                        onClick={() => setMode('scan')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex items-center gap-3 px-8 py-4 rounded-xl text-xl font-semibold transition-all ${mode === 'scan'
                            ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/50'
                            : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                    >
                        <Scan className="w-7 h-7" />
                        Scan Physical Item
                    </motion.button>
                </div>
            </div>

            {/* Product Grid */}
            {mode === 'browse' ? (
                <div className="flex-1 overflow-auto p-10 relative z-10">
                    <div className="grid grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {PRODUCTS.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => handleProductSelect(product)}
                                whileHover={{ scale: 1.03, y: -5 }}
                                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-purple-500/30 transition-all cursor-pointer"
                            >
                                <div className="aspect-square bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center text-9xl">
                                    {product.image}
                                </div>
                                <div className="p-6">
                                    <h3 className="font-bold text-2xl text-white mb-2">{product.name}</h3>
                                    <p className="text-lg text-cyan-200 mb-3">{product.category}</p>
                                    <p className="text-3xl font-bold text-purple-300">₹{product.price}</p>
                                    <div className="flex gap-3 mt-4">
                                        {product.sizes.slice(0, 3).map(size => (
                                            <span key={size} className="px-4 py-2 bg-white/10 text-white text-lg rounded-lg">{size}</span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center relative z-10">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-16 max-w-3xl text-center"
                    >
                        <Scan className="w-32 h-32 text-orange-400 mx-auto mb-8 animate-pulse" />
                        <h2 className="text-5xl font-bold text-white mb-6">Scan Physical Garment</h2>
                        <p className="text-cyan-200 text-2xl mb-10">Hold the RFID tag or QR code in front of the scanner</p>

                        <div className="bg-orange-500/20 border-4 border-dashed border-orange-400 rounded-2xl p-16 mb-10">
                            <p className="text-orange-300 text-3xl font-semibold">Place item here</p>
                        </div>

                        <motion.button
                            onClick={() => handleProductSelect(PRODUCTS[0])}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-12 py-5 rounded-xl text-2xl font-bold shadow-lg shadow-orange-500/50"
                        >
                            Simulate Scan Success
                        </motion.button>

                        <button
                            onClick={() => setMode('browse')}
                            className="mt-6 text-cyan-300 underline block mx-auto hover:text-white text-xl"
                        >
                            ← Back to Catalog
                        </button>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
