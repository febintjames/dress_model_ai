"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ScanBarcode, Loader2 } from "lucide-react";

interface ScannerInputProps {
    onScan: (code: string) => void;
}

export default function ScannerInput({ onScan }: ScannerInputProps) {
    const [code, setCode] = useState("");
    const [isScanning, setIsScanning] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!code) return;

        setIsScanning(true);
        // Simulate API delay
        setTimeout(() => {
            setIsScanning(false);
            onScan(code);
            setCode("");
        }, 1500);
    };

    return (
        <div className="flex flex-col items-center justify-center h-full p-8">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-md glass-panel p-8 rounded-3xl text-center space-y-6"
            >
                <div className="relative w-20 h-20 mx-auto bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                    {isScanning ? (
                        <Loader2 className="animate-spin text-accent" size={32} />
                    ) : (
                        <ScanBarcode className="text-white/70" size={32} />
                    )}
                    {/* Laser animation */}
                    {!isScanning && (
                        <div className="absolute top-0 w-full h-0.5 bg-red-500/80 shadow-[0_0_10px_red] animate-[scan_2s_ease-in-out_infinite]" />
                    )}
                </div>

                <div>
                    <h3 className="text-xl text-white font-light">Scan Physical Item</h3>
                    <p className="text-sm text-white/40 mt-1">Point the scanner or enter details below</p>
                </div>

                <form onSubmit={handleSubmit} className="relative">
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Enter Barcode ID..."
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-accent transition-colors text-center tracking-widest"
                        autoFocus
                    />
                </form>

                <p className="text-xs text-white/20">Try '12345' for demo</p>
            </motion.div>
        </div>
    );
}
