"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Tag } from "lucide-react";
import { staggerContainer, scaleIn } from "@/lib/animations";

// Mock Data
const PRODUCTS = [
    { id: 1, name: "Cyber Jacket", price: "$120", category: "Outerwear", color: "bg-purple-500" },
    { id: 2, name: "Neural Hoodie", price: "$85", category: "Tops", color: "bg-blue-600" },
    { id: 3, name: "Void Pants", price: "$90", category: "Bottoms", color: "bg-zinc-800" },
    { id: 4, name: "Glow Sneakers", price: "$150", category: "Footwear", color: "bg-green-500" },
    { id: 5, name: "Flux Tee", price: "$45", category: "Tops", color: "bg-pink-600" },
    { id: 6, name: "Nano Vest", price: "$110", category: "Outerwear", color: "bg-orange-500" },
];

interface ProductGridProps {
    onSelect: (product: any) => void;
}

export default function ProductGrid({ onSelect }: ProductGridProps) {
    return (
        <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-2 md:grid-cols-3 gap-6 overflow-y-auto pr-2 h-[60vh] scrollbar-hide"
        >
            {PRODUCTS.map((product) => (
                <motion.div
                    key={product.id}
                    variants={scaleIn}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelect(product)}
                    className="glass-panel group relative rounded-xl overflow-hidden cursor-pointer"
                >
                    {/* Image Placeholder */}
                    <div className={`h-48 w-full ${product.color} opacity-80 group-hover:opacity-100 transition-opacity flex items-center justify-center`}>
                        <ShoppingBag className="text-white/50 w-12 h-12" />
                    </div>

                    {/* Info */}
                    <div className="p-4 bg-black/40 backdrop-blur-md absolute bottom-0 w-full">
                        <h3 className="text-white font-medium text-lg">{product.name}</h3>
                        <div className="flex justify-between items-center mt-1">
                            <span className="text-accent text-sm font-bold">{product.price}</span>
                            <span className="text-xs text-white/50 bg-white/10 px-2 py-0.5 rounded flex items-center gap-1">
                                <Tag size={10} /> {product.category}
                            </span>
                        </div>
                    </div>

                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </motion.div>
            ))}
        </motion.div>
    );
}
