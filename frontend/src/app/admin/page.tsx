"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Upload, Package, Users, DollarSign } from "lucide-react";

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<'overview' | 'products'>('overview');

    return (
        <div className="flex h-screen w-full bg-background text-foreground font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 glass-panel border-r border-white/10 flex flex-col p-6">
                <h2 className="text-2xl font-bold text-white mb-10 tracking-widest">ADMIN</h2>
                <nav className="space-y-2">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-accent text-white' : 'text-white/50 hover:bg-white/5'}`}
                    >
                        <BarChart size={20} /> Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === 'products' ? 'bg-accent text-white' : 'text-white/50 hover:bg-white/5'}`}
                    >
                        <Package size={20} /> Products
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-light text-white uppercase">{activeTab}</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-white/50">Admin User</span>
                        <div className="w-10 h-10 bg-accent rounded-full" />
                    </div>
                </header>

                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-3 gap-6">
                            <div className="glass-panel p-6 rounded-2xl">
                                <div className="flex items-center gap-4 text-white/50 mb-2">
                                    <Users size={18} /> Daily Users
                                </div>
                                <h3 className="text-4xl text-white font-bold">124</h3>
                                <p className="text-green-400 text-sm mt-2">+12% from yesterday</p>
                            </div>
                            <div className="glass-panel p-6 rounded-2xl">
                                <div className="flex items-center gap-4 text-white/50 mb-2">
                                    <Package size={18} /> Items Tried
                                </div>
                                <h3 className="text-4xl text-white font-bold">856</h3>
                                <p className="text-green-400 text-sm mt-2">Avg 7 items/user</p>
                            </div>
                            <div className="glass-panel p-6 rounded-2xl">
                                <div className="flex items-center gap-4 text-white/50 mb-2">
                                    <DollarSign size={18} /> Cart Conversion
                                </div>
                                <h3 className="text-4xl text-white font-bold">42%</h3>
                                <p className="text-yellow-400 text-sm mt-2">-2% from last week</p>
                            </div>
                        </div>

                        {/* Top Items Chart */}
                        <div className="glass-panel p-8 rounded-3xl">
                            <h3 className="text-xl text-white mb-6">Most Tried Items</h3>
                            <div className="space-y-4">
                                {['Cyber Jacket', 'Neon Pants', 'Void T-Shirt', 'Holo Sneakers'].map((item, i) => (
                                    <div key={item} className="space-y-2">
                                        <div className="flex justify-between text-sm text-white/70">
                                            <span>{item}</span>
                                            <span>{90 - i * 15} tries</span>
                                        </div>
                                        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${90 - i * 15}%` }}
                                                transition={{ duration: 1, delay: 0.2 * i }}
                                                className="h-full bg-gradient-to-r from-accent to-purple-400"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'products' && (
                    <div className="glass-panel p-12 rounded-3xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-center space-y-4 hover:border-accent transition-colors cursor-pointer text-white/50 hover:text-white">
                        <Upload size={48} />
                        <h3 className="text-xl">Upload New Product Image</h3>
                        <p className="text-sm opacity-50">Drag & Drop or Click to Browse</p>
                    </div>
                )}
            </main>
        </div>
    );
}
