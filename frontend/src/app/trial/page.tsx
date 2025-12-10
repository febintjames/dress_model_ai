"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Info, Check, Camera, User, RotateCw, Zap, Phone, ShoppingCart, QrCode } from "lucide-react";
import { useKioskStore } from "@/lib/store";

// Product types for different body positions
type ClothingType = 'dress' | 'top' | 'bottom' | 'shoes' | 'belt' | 'sunglasses' | 'bag';
type ColorType = 'white' | 'black' | 'blue' | 'orange' | 'brown' | 'pink' | 'navy' | 'beige' | 'red' | 'green';
type GenderType = 'male' | 'female' | 'unisex';

interface Product {
    id: number;
    name: string;
    category?: string;
    price: number;
    image: string;
    type: ClothingType;
    color: ColorType;
    gender: GenderType;
}

// Products organized by gender
const ALL_PRODUCTS: Product[] = [
    // FEMALE PRODUCTS
    { id: 1, name: 'Summer Floral Dress', category: 'Dresses', price: 2499, image: '👗', type: 'dress', color: 'pink', gender: 'female' },
    { id: 2, name: 'Navy Evening Gown', category: 'Dresses', price: 3499, image: '👗', type: 'dress', color: 'navy', gender: 'female' },
    { id: 3, name: 'Pink Blouse', category: 'Tops', price: 999, image: '👚', type: 'top', color: 'pink', gender: 'female' },
    { id: 4, name: 'White Elegant Top', category: 'Tops', price: 1199, image: '👚', type: 'top', color: 'white', gender: 'female' },
    { id: 5, name: 'Beige Skirt', category: 'Bottoms', price: 1299, image: '👗', type: 'bottom', color: 'beige', gender: 'female' },
    { id: 6, name: 'Black Leggings', category: 'Bottoms', price: 899, image: '👖', type: 'bottom', color: 'black', gender: 'female' },
    { id: 7, name: 'Pink High Heels', price: 2499, image: '👠', type: 'shoes', color: 'pink', gender: 'female' },
    { id: 8, name: 'Black Stilettos', price: 2999, image: '👠', type: 'shoes', color: 'black', gender: 'female' },
    { id: 9, name: 'Beige Handbag', price: 2199, image: '👜', type: 'bag', color: 'beige', gender: 'female' },
    { id: 10, name: 'Black Clutch', price: 1499, image: '👛', type: 'bag', color: 'black', gender: 'female' },

    // MALE PRODUCTS
    { id: 11, name: 'Orange Polo Shirt', category: 'Tops', price: 999, image: '👕', type: 'top', color: 'orange', gender: 'male' },
    { id: 12, name: 'White Formal Shirt', category: 'Tops', price: 1199, image: '👔', type: 'top', color: 'white', gender: 'male' },
    { id: 13, name: 'Blue Casual Tee', category: 'Tops', price: 799, image: '👕', type: 'top', color: 'blue', gender: 'male' },
    { id: 14, name: 'Navy Chinos', category: 'Bottoms', price: 1899, image: '👖', type: 'bottom', color: 'navy', gender: 'male' },
    { id: 15, name: 'Beige Trousers', category: 'Bottoms', price: 1699, image: '👖', type: 'bottom', color: 'beige', gender: 'male' },
    { id: 16, name: 'Black Jeans', category: 'Bottoms', price: 1999, image: '👖', type: 'bottom', color: 'black', gender: 'male' },
    { id: 17, name: 'White Sneakers', price: 1299, image: '👟', type: 'shoes', color: 'white', gender: 'male' },
    { id: 18, name: 'Brown Loafers', price: 2499, image: '👞', type: 'shoes', color: 'brown', gender: 'male' },
    { id: 19, name: 'Black Formal Shoes', price: 2999, image: '👞', type: 'shoes', color: 'black', gender: 'male' },

    // UNISEX ACCESSORIES
    { id: 20, name: 'Brown Leather Belt', price: 799, image: '🎗️', type: 'belt', color: 'brown', gender: 'unisex' },
    { id: 21, name: 'Black Belt', price: 699, image: '🎗️', type: 'belt', color: 'black', gender: 'unisex' },
    { id: 22, name: 'Black Sunglasses', price: 1499, image: '🕶️', type: 'sunglasses', color: 'black', gender: 'unisex' },
    { id: 23, name: 'Brown Aviators', price: 1299, image: '🕶️', type: 'sunglasses', color: 'brown', gender: 'unisex' },
];

// Color matching rules - which colors go well together
const COLOR_MATCHES: Record<ColorType, ColorType[]> = {
    orange: ['navy', 'white', 'beige', 'brown', 'black'],
    white: ['navy', 'black', 'blue', 'brown', 'beige', 'orange', 'pink'],
    black: ['white', 'beige', 'red', 'pink', 'blue'],
    blue: ['white', 'beige', 'brown', 'navy'],
    navy: ['white', 'beige', 'brown', 'orange', 'pink'],
    brown: ['white', 'beige', 'navy', 'orange', 'blue'],
    pink: ['white', 'navy', 'black', 'beige'],
    beige: ['navy', 'brown', 'white', 'black', 'blue', 'orange', 'pink'],
    red: ['white', 'black', 'navy', 'beige'],
    green: ['white', 'beige', 'brown', 'black'],
};

// Get products filtered by gender
const getProductsByGender = (gender: string | null): Product[] => {
    const userGender = gender?.toLowerCase() || 'male';
    return ALL_PRODUCTS.filter(product =>
        product.gender === userGender || product.gender === 'unisex'
    );
};

// Get matching suggestions based on current outfit colors and gender
// Logic: Suggest items that COMPLETE the outfit (not same type as selected)
const getMatchingSuggestions = (outfit: OutfitState, selectedItem: Product, gender: string | null): Product[] => {
    const currentColor = selectedItem.color;
    const matchingColors = COLOR_MATCHES[currentColor] || [];
    const genderProducts = getProductsByGender(gender);

    // Get all items that match the current color and aren't already in outfit
    const outfitIds = Object.values(outfit).filter(Boolean).map(item => item!.id);

    // Define complementary types - what items go well with each type
    const complementaryTypes: Record<string, string[]> = {
        'dress': ['shoes', 'bag', 'sunglasses', 'belt'], // Dress is complete, add accessories
        'top': ['bottom', 'shoes', 'bag', 'sunglasses', 'belt'], // Top needs bottoms
        'bottom': ['top', 'shoes', 'bag', 'sunglasses', 'belt'], // Bottom needs top
        'shoes': ['top', 'bottom', 'dress', 'bag', 'sunglasses'],
        'bag': ['top', 'bottom', 'dress', 'shoes'],
        'belt': ['top', 'bottom', 'dress', 'shoes'],
        'sunglasses': ['top', 'bottom', 'dress', 'shoes', 'bag'],
    };

    // Get what types would complement the selected item
    const neededTypes = complementaryTypes[selectedItem.type] || [];

    return genderProducts.filter(product => {
        // Don't suggest items already in outfit
        if (outfitIds.includes(product.id)) return false;
        // Don't suggest the currently selected item
        if (product.id === selectedItem.id) return false;
        // Only suggest complementary types (not the same type)
        if (!neededTypes.includes(product.type)) return false;
        // Prioritize items with matching colors
        return matchingColors.includes(product.color);
    }).slice(0, 4); // Limit to 4 suggestions
};

// Track outfit as separate slots
interface OutfitState {
    dress: Product | null;
    top: Product | null;
    bottom: Product | null;
    shoes: Product | null;
    belt: Product | null;
    sunglasses: Product | null;
    bag: Product | null;
}

export default function TrialPage() {
    const router = useRouter();
    const { cart, addToCart, userProfile, selectedProduct } = useKioskStore();
    const [step, setStep] = useState<'consent' | 'ready' | 'scanning' | 'trial'>('consent');
    const [scanProgress, setScanProgress] = useState(0);
    const [heatMapVisible, setHeatMapVisible] = useState(false);
    const [lightingMode, setLightingMode] = useState('daylight');
    const [isRotating, setIsRotating] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [addedToCart, setAddedToCart] = useState<number[]>([]);
    const [particles, setParticles] = useState<Array<{ x: number, y: number, duration: number, delay: number }>>([]);

    // Get user's gender from profile (default to male)
    const userGender = userProfile?.gender?.toLowerCase() || 'male';

    // Get products filtered by gender
    const PRODUCTS = getProductsByGender(userGender);

    // Get the appropriate avatar based on gender
    const getAvatarEmoji = () => {
        if (userGender === 'female') return '👩';
        if (userGender === 'male') return '👨';
        return '🧑'; // Neutral
    };

    // Get initial product based on gender OR the product selected from selection page
    const getInitialProduct = () => {
        // If a product was selected from the selection page, use it
        if (selectedProduct) {
            // Find matching product in our catalog by name
            const matching = ALL_PRODUCTS.find(p => p.name === selectedProduct.name);
            if (matching) return matching;
        }
        // Otherwise default based on gender
        const products = getProductsByGender(userGender);
        return userGender === 'female'
            ? products.find(p => p.type === 'dress') || products[0]
            : products.find(p => p.type === 'top') || products[0];
    };

    // Separate outfit slots - each clothing type is independent
    const [outfit, setOutfit] = useState<OutfitState>({
        dress: null,
        top: null,
        bottom: null,
        shoes: null,
        belt: null,
        sunglasses: null,
        bag: null,
    });

    // Currently selected item for display
    const [selectedItem, setSelectedItem] = useState<Product | null>(null);

    // Update outfit and products when gender or selectedProduct changes (after store hydration)
    useEffect(() => {
        const initial = getInitialProduct();
        if (initial) {
            setOutfit({
                dress: initial.type === 'dress' ? initial : null,
                top: initial.type === 'top' ? initial : null,
                bottom: initial.type === 'bottom' ? initial : null,
                shoes: initial.type === 'shoes' ? initial : null,
                belt: initial.type === 'belt' ? initial : null,
                sunglasses: initial.type === 'sunglasses' ? initial : null,
                bag: initial.type === 'bag' ? initial : null,
            });
            setSelectedItem(initial);
        }
    }, [userGender, selectedProduct]);

    useEffect(() => {
        const newParticles = [...Array(15)].map(() => ({
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: (typeof window !== 'undefined' ? window.innerHeight : 1000) + 50,
            duration: Math.random() * 10 + 10,
            delay: Math.random() * 5
        }));
        setParticles(newParticles);
    }, []);

    const startScan = () => {
        setStep('scanning');
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            setScanProgress(progress);
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => setStep('trial'), 500);
            }
        }, 50);
    };

    const handleTryItem = (item: Product) => {
        // Update the specific clothing slot based on item type
        setOutfit(prev => ({
            ...prev,
            // If trying a dress, clear top/bottom since dress replaces them
            ...(item.type === 'dress' ? { top: null, bottom: null } : {}),
            // If trying top or bottom, clear dress since they replace it
            ...((item.type === 'top' || item.type === 'bottom') ? { dress: null } : {}),
            [item.type]: item,
        }));
        setSelectedItem(item);
    };

    const handleAddToCart = (item: Product) => {
        addToCart(item);
        setAddedToCart([...addedToCart, item.id]);
    };

    const isInCart = (id: number) => addedToCart.includes(id) || cart.some((c: any) => c.id === id);

    // Get all active outfit items for display
    const getActiveOutfitItems = () => {
        return Object.values(outfit).filter(Boolean) as Product[];
    };

    return (
        <div className="h-screen relative overflow-hidden">
            <AnimatePresence mode="wait">
                {/* Privacy Consent & Ready & Scanning */}
                {(step === 'consent' || step === 'ready' || step === 'scanning') && (
                    <motion.div
                        key="privacy-stages"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-full bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 animate-gradient flex items-center justify-center relative"
                    >
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

                        {step === 'consent' && (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-16 max-w-4xl relative z-10"
                            >
                                <div className="flex items-center gap-6 mb-8">
                                    <Info className="w-16 h-16 text-emerald-400" />
                                    <h2 className="text-5xl font-bold text-white">Privacy & Data Protection</h2>
                                </div>

                                <div className="bg-emerald-500/20 border border-emerald-400/30 rounded-2xl p-8 mb-8">
                                    <p className="text-emerald-100 text-2xl leading-relaxed mb-6">
                                        We use your body scan <strong>only for this fitting session</strong>. Your data will be:
                                    </p>
                                    <ul className="space-y-4 text-emerald-100 text-xl">
                                        {['Used only to show how clothes fit you', 'Never stored on our servers', 'Automatically deleted when session ends', 'Never shared with third parties'].map((text, i) => (
                                            <li key={i} className="flex items-center gap-4">
                                                <Check className="w-8 h-8 text-emerald-400" />
                                                {text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <motion.button
                                    onClick={() => setStep('ready')}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-6 rounded-2xl text-3xl font-bold shadow-lg shadow-emerald-500/50 mb-4"
                                >
                                    I Agree - Continue
                                </motion.button>
                                <button onClick={() => router.back()} className="w-full text-emerald-300 py-4 text-xl hover:text-white">
                                    Go Back
                                </button>
                            </motion.div>
                        )}

                        {step === 'ready' && (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-16 max-w-4xl text-center relative z-10"
                            >
                                <Camera className="w-32 h-32 text-cyan-400 mx-auto mb-8" />
                                <h2 className="text-5xl font-bold text-white mb-6">Ready to Scan</h2>
                                <p className="text-cyan-200 text-2xl mb-10">Stand in the marked area with arms slightly away from body</p>

                                <div className="bg-cyan-500/20 rounded-2xl p-10 mb-10">
                                    <div className="border-4 border-dashed border-cyan-400 rounded-2xl p-16 inline-block">
                                        <User className="w-40 h-40 text-cyan-400 mx-auto" />
                                        <p className="text-cyan-300 font-bold text-2xl mt-4">Stand Here</p>
                                    </div>
                                </div>

                                <motion.button
                                    onClick={startScan}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-6 rounded-2xl text-3xl font-bold shadow-lg shadow-cyan-500/50"
                                >
                                    Start 3D Body Scan
                                </motion.button>
                            </motion.div>
                        )}

                        {step === 'scanning' && (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-16 max-w-4xl text-center relative z-10"
                            >
                                <div className="relative w-64 h-64 mx-auto mb-8">
                                    <div className="absolute inset-0 border-8 border-cyan-200/30 rounded-full"></div>
                                    <div className="absolute inset-0 border-8 border-cyan-400 rounded-full animate-spin border-t-transparent"></div>
                                    <User className="absolute inset-0 m-auto w-32 h-32 text-cyan-400" />
                                </div>
                                <h2 className="text-5xl font-bold text-white mb-6">Scanning Your Body...</h2>
                                <p className="text-cyan-200 text-2xl mb-6">Mapping skeletal joints and body contours</p>
                                <div className="bg-cyan-500/20 rounded-2xl p-6 max-w-lg mx-auto">
                                    <div className="flex justify-between text-xl text-cyan-200 mb-3">
                                        <span>Progress</span>
                                        <span>{scanProgress}%</span>
                                    </div>
                                    <div className="bg-cyan-900/50 rounded-full h-6 overflow-hidden">
                                        <motion.div className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full" style={{ width: `${scanProgress}%` }} />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {/* Virtual Try-On */}
                {step === 'trial' && (
                    <motion.div
                        key="trial"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 animate-gradient flex relative"
                    >
                        {/* Main View - FULL BODY AVATAR WITH CLOTHES FITTING ON IT */}
                        <div className="flex-1 relative flex items-center justify-center">
                            <div className="relative flex flex-col items-center justify-center" style={{ height: '85vh' }}>
                                {/* FULL BODY STANDING PERSON with CLOTHING OVERLAYS */}
                                <motion.div
                                    className="relative"
                                    animate={{
                                        y: [0, -8, 0],
                                        rotateY: rotation
                                    }}
                                    transition={{
                                        y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
                                        rotateY: { duration: 2, ease: "easeInOut" }
                                    }}
                                    style={{ transformStyle: 'preserve-3d' }}
                                >
                                    {/* Base Full Body Avatar - Standing Person */}
                                    <div style={{ fontSize: '65vh', lineHeight: 1 }}>
                                        {userGender === 'female' ? '🧍‍♀️' : '🧍‍♂️'}
                                    </div>

                                    {/* Clothing overlays positioned ON the body */}

                                    {/* Sunglasses - on face */}
                                    <AnimatePresence mode="wait">
                                        {outfit.sunglasses && (
                                            <motion.div
                                                key="sunglasses"
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0, opacity: 0 }}
                                                className="absolute left-1/2 -translate-x-1/2"
                                                style={{ top: '8%', fontSize: '6vh' }}
                                            >
                                                {outfit.sunglasses.image}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Top/Dress - on torso - SMALLER so it fits the body */}
                                    <AnimatePresence mode="wait">
                                        {(outfit.dress || outfit.top) && (
                                            <motion.div
                                                key={outfit.dress ? `dress-${outfit.dress.id}` : `top-${outfit.top?.id}`}
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0.8, opacity: 0 }}
                                                className="absolute left-1/2 -translate-x-1/2"
                                                style={{ top: outfit.dress ? '20%' : '23%', fontSize: outfit.dress ? '25vh' : '18vh' }}
                                            >
                                                {outfit.dress?.image || outfit.top?.image}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Belt - on waist */}
                                    <AnimatePresence mode="wait">
                                        {outfit.belt && (
                                            <motion.div
                                                key="belt"
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0, opacity: 0 }}
                                                className="absolute left-1/2 -translate-x-1/2"
                                                style={{ top: '42%', fontSize: '4vh' }}
                                            >
                                                {outfit.belt.image}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Pants/Bottom - on legs - sized to fit avatar */}
                                    <AnimatePresence mode="wait">
                                        {outfit.bottom && !outfit.dress && (
                                            <motion.div
                                                key={`bottom-${outfit.bottom.id}`}
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0.8, opacity: 0 }}
                                                className="absolute left-1/2 -translate-x-1/2"
                                                style={{ top: '45%', fontSize: '28vh' }}
                                            >
                                                {outfit.bottom.image}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Shoes - on feet - TWO SHOES at outer feet positions */}
                                    <AnimatePresence mode="wait">
                                        {outfit.shoes && (
                                            <motion.div
                                                key={`shoes-${outfit.shoes.id}`}
                                                initial={{ scale: 0, opacity: 0, y: 10 }}
                                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                                exit={{ scale: 0, opacity: 0 }}
                                                className="absolute w-full flex justify-center"
                                                style={{ bottom: '-8%', gap: '0vh' }}
                                            >
                                                {/* Left shoe - flipped */}
                                                <span style={{ fontSize: '8vh', transform: 'scaleX(-1)' }}>
                                                    {outfit.shoes.image}
                                                </span>
                                                {/* Right shoe */}
                                                <span style={{ fontSize: '8vh' }}>
                                                    {outfit.shoes.image}
                                                </span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Bag - on side */}
                                    <AnimatePresence mode="wait">
                                        {outfit.bag && (
                                            <motion.div
                                                key="bag"
                                                initial={{ scale: 0, opacity: 0, x: 20 }}
                                                animate={{ scale: 1, opacity: 1, x: 0 }}
                                                exit={{ scale: 0, opacity: 0 }}
                                                className="absolute"
                                                style={{ top: '35%', right: '5%', fontSize: '8vh' }}
                                            >
                                                {outfit.bag.image}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>

                                {heatMapVisible && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 via-yellow-500/30 to-red-500/30 rounded-3xl animate-pulse pointer-events-none">
                                        <div className="absolute top-6 right-6 bg-black/90 rounded-2xl p-6 text-xl text-white">
                                            <div className="flex items-center gap-4 mb-3"><div className="w-6 h-6 bg-green-500 rounded"></div><span>Perfect Fit</span></div>
                                            <div className="flex items-center gap-4 mb-3"><div className="w-6 h-6 bg-yellow-500 rounded"></div><span>Snug</span></div>
                                            <div className="flex items-center gap-4"><div className="w-6 h-6 bg-red-500 rounded"></div><span>Tight</span></div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Fit Accuracy Badge */}
                            <div className="absolute top-10 left-10 bg-emerald-500 text-white px-10 py-5 rounded-full flex items-center gap-4 shadow-lg shadow-emerald-500/50 text-2xl font-bold">
                                <Check className="w-10 h-10" />
                                <span>98% Fit Accuracy</span>
                            </div>

                            {/* Current Item Display */}
                            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-md px-10 py-5 rounded-full text-white text-2xl font-bold border border-white/20">
                                Trying: {selectedItem.name}
                            </div>

                            {/* Bottom Controls */}
                            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-6">
                                {/* 360° Rotation Controls */}
                                <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-full flex items-center gap-4 border border-white/20">
                                    <motion.button
                                        onClick={() => setRotation(prev => prev - 45)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="w-14 h-14 bg-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg"
                                    >
                                        ←
                                    </motion.button>
                                    <div className="text-white text-xl font-bold px-4">
                                        <RotateCw className="w-8 h-8 inline mr-2" />
                                        360°
                                    </div>
                                    <motion.button
                                        onClick={() => setRotation(prev => prev + 45)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="w-14 h-14 bg-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg"
                                    >
                                        →
                                    </motion.button>
                                    <motion.button
                                        onClick={() => setRotation(0)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-4 py-2 bg-white/20 rounded-lg text-white text-lg"
                                    >
                                        Reset
                                    </motion.button>
                                </div>

                                <motion.button
                                    onClick={() => setHeatMapVisible(!heatMapVisible)}
                                    whileHover={{ scale: 1.05 }}
                                    className={`px-10 py-5 rounded-full flex items-center gap-4 border text-2xl font-bold ${heatMapVisible ? 'bg-orange-500 text-white border-orange-400' : 'bg-white/10 backdrop-blur-md text-white border-white/20'}`}
                                >
                                    <Zap className="w-10 h-10" />
                                    {heatMapVisible ? 'Hide' : 'Show'} Fit Map
                                </motion.button>
                            </div>

                            {/* Lighting Control */}
                            <div className="absolute top-10 right-10 bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                                <p className="text-2xl font-bold text-white mb-4">Lighting</p>
                                <div className="space-y-3">
                                    {['daylight', 'office', 'evening'].map((mode: string) => (
                                        <button
                                            key={mode}
                                            onClick={() => setLightingMode(mode)}
                                            className={`block w-full text-left px-6 py-4 rounded-xl text-xl ${lightingMode === mode ? 'bg-purple-500 text-white' : 'text-white/70 hover:bg-white/10'
                                                }`}
                                        >
                                            {mode.charAt(0).toUpperCase() + mode.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Call Attendant */}
                            <div className="absolute bottom-20 right-10">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-10 py-5 rounded-full flex items-center gap-4 shadow-lg shadow-orange-500/50 text-2xl font-bold"
                                >
                                    <Phone className="w-10 h-10" />
                                    Call Attendant
                                </motion.button>
                            </div>
                        </div>

                        {/* Sidebar - Enlarged for Kiosk */}
                        <div className="w-[550px] bg-white/10 backdrop-blur-md border-l border-white/20 overflow-auto">
                            <div className="p-12">
                                <h3 className="text-5xl font-bold text-white mb-10">Complete The Look</h3>

                                {/* Show loading or content based on selectedItem */}
                                {selectedItem ? (
                                    <>
                                        {/* Current Item Card */}
                                        <div className="bg-purple-500/20 rounded-3xl p-10 mb-10 border border-purple-400/30">
                                            <p className="text-2xl text-purple-300 font-bold mb-4">Currently Trying</p>
                                            <div className="flex items-center gap-6">
                                                <div style={{ fontSize: '6rem' }}>{selectedItem.image}</div>
                                                <div>
                                                    <p className="font-bold text-white text-3xl">{selectedItem.name}</p>
                                                    <p className="text-purple-300 font-bold text-4xl">₹{selectedItem.price}</p>
                                                    <p className="text-purple-200 text-xl mt-2 capitalize">Color: {selectedItem.color}</p>
                                                </div>
                                            </div>
                                            <motion.button
                                                onClick={() => handleAddToCart(selectedItem)}
                                                whileHover={{ scale: 1.02 }}
                                                disabled={isInCart(selectedItem.id)}
                                                className={`w-full mt-8 py-6 rounded-2xl flex items-center justify-center gap-4 text-3xl font-bold transition-all ${isInCart(selectedItem.id)
                                                    ? 'bg-emerald-500 text-white cursor-default'
                                                    : 'bg-purple-500 text-white hover:bg-purple-600'
                                                    }`}
                                            >
                                                {isInCart(selectedItem.id) ? (
                                                    <>
                                                        <Check className="w-10 h-10" />
                                                        Added to Cart ✓
                                                    </>
                                                ) : (
                                                    <>
                                                        <ShoppingCart className="w-10 h-10" />
                                                        Add to Cart
                                                    </>
                                                )}
                                            </motion.button>
                                        </div>

                                        {/* Color-Matched Suggestions */}
                                        <div className="space-y-6 mb-10">
                                            <div className="flex items-center gap-3">
                                                <span className="text-4xl">🎨</span>
                                                <h4 className="font-bold text-emerald-300 text-3xl">Matches Your {selectedItem.color.charAt(0).toUpperCase() + selectedItem.color.slice(1)} Style</h4>
                                            </div>
                                            <p className="text-purple-200 text-xl">Items that pair perfectly with your selection</p>

                                            {getMatchingSuggestions(outfit, selectedItem, userGender).length > 0 ? (
                                                getMatchingSuggestions(outfit, selectedItem, userGender).map(item => (
                                                    <motion.div
                                                        key={item.id}
                                                        whileHover={{ scale: 1.02 }}
                                                        className="bg-emerald-500/10 rounded-2xl p-6 cursor-pointer border border-emerald-400/30 hover:border-emerald-400/60 transition-all"
                                                    >
                                                        <div className="flex items-center gap-6">
                                                            <div style={{ fontSize: '5rem' }}>{item.image}</div>
                                                            <div className="flex-1">
                                                                <p className="font-bold text-white text-2xl">{item.name}</p>
                                                                <p className="text-emerald-300 font-bold text-3xl">₹{item.price}</p>
                                                                <p className="text-emerald-200 text-lg capitalize">Color: {item.color}</p>
                                                            </div>
                                                            <motion.button
                                                                onClick={() => handleTryItem(item)}
                                                                whileHover={{ scale: 1.1 }}
                                                                className="bg-emerald-500 text-white px-8 py-4 rounded-2xl text-2xl font-bold"
                                                            >
                                                                Try →
                                                            </motion.button>
                                                        </div>
                                                    </motion.div>
                                                ))
                                            ) : (
                                                <p className="text-purple-300 text-xl">Try a different item to see matching suggestions!</p>
                                            )}
                                        </div>

                                        {/* All Other Items */}
                                        <div className="space-y-6">
                                            <h4 className="font-bold text-purple-200 text-3xl">Browse All Items</h4>
                                            {PRODUCTS.filter(p => p.id !== selectedItem.id).slice(0, 3).map(item => (
                                                <motion.div
                                                    key={item.id}
                                                    whileHover={{ scale: 1.02 }}
                                                    className="bg-white/5 rounded-2xl p-6 cursor-pointer border border-white/10 hover:border-purple-400/50 transition-all"
                                                >
                                                    <div className="flex items-center gap-6">
                                                        <div style={{ fontSize: '4rem' }}>{item.image}</div>
                                                        <div className="flex-1">
                                                            <p className="font-bold text-white text-xl">{item.name}</p>
                                                            <p className="text-purple-300 font-bold text-2xl">₹{item.price}</p>
                                                        </div>
                                                        <motion.button
                                                            onClick={() => handleTryItem(item)}
                                                            whileHover={{ scale: 1.1 }}
                                                            className="bg-purple-500 text-white px-6 py-3 rounded-xl text-xl font-bold"
                                                        >
                                                            Try →
                                                        </motion.button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>

                                        {/* Bottom Actions */}
                                        <div className="mt-12 space-y-5">
                                            <motion.button
                                                onClick={() => router.push('/cart')}
                                                whileHover={{ scale: 1.02 }}
                                                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-8 rounded-2xl text-3xl font-bold flex items-center justify-center gap-4 shadow-lg shadow-purple-500/30"
                                            >
                                                <ShoppingCart className="w-12 h-12" />
                                                View Cart ({cart.length + addedToCart.length})
                                            </motion.button>
                                            <button className="w-full bg-white/10 border border-white/20 text-white py-6 rounded-2xl text-2xl font-bold flex items-center justify-center gap-4">
                                                <QrCode className="w-10 h-10" />
                                                Save to Mobile
                                            </button>
                                            <button onClick={() => router.push('/selection')} className="w-full text-purple-300 py-5 text-2xl hover:text-white">
                                                ← Try Different Items
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-20">
                                        <div className="text-6xl mb-4">👗</div>
                                        <p className="text-white text-2xl">Loading your personalized items...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
