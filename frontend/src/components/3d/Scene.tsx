"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment, Float, Html } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import { useKioskStore } from "@/lib/store";

interface SceneProps {
    lightingMode?: 'daylight' | 'office' | 'evening';
    showHeatmap?: boolean;
}

function Avatar({ showHeatmap }: { showHeatmap: boolean }) {
    const meshRef = useRef<any>(null);
    const [hovered, setHover] = useState(false);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime / 2) * 0.2;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <group position={[0, -1, 0]}>
                {/* Visual Mesh */}
                <mesh
                    ref={meshRef}
                    onPointerOver={() => setHover(true)}
                    onPointerOut={() => setHover(false)}
                >
                    <capsuleGeometry args={[0.5, 2, 8, 16]} />
                    <meshStandardMaterial
                        color={showHeatmap ? "#10B981" : (hovered ? "#7C3AED" : "#ffffff")}
                        roughness={0.2}
                        metalness={0.8}
                        wireframe={false}
                    />
                </mesh>

                {/* Heatmap Overlay (Mock) */}
                {showHeatmap && (
                    <mesh scale={[1.05, 1.05, 1.05]} position={[0, 0, 0]}>
                        <capsuleGeometry args={[0.5, 2, 8, 16]} />
                        <meshBasicMaterial
                            color="#EF4444"
                            wireframe
                            transparent
                            opacity={0.5}
                        />
                        <Html position={[0.8, 0.5, 0]}>
                            <div className="bg-white/90 p-2 rounded text-xs shadow-xl backdrop-blur-md">
                                <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 bg-green-500 rounded-full" /> Perfect Fit</div>
                                <div className="flex items-center gap-2"><div className="w-2 h-2 bg-red-500 rounded-full" /> Tight</div>
                            </div>
                        </Html>
                    </mesh>
                )}

                {/* Holographic Effect Layers */}
                {!showHeatmap && (
                    <mesh scale={[1.1, 1.1, 1.1]}>
                        <capsuleGeometry args={[0.5, 2, 8, 16]} />
                        <meshStandardMaterial
                            color="#7C3AED"
                            wireframe
                            transparent
                            opacity={0.3}
                        />
                    </mesh>
                )}

                <Html position={[0, 2.5, 0]} center>
                    <div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded text-white text-xs whitespace-nowrap border border-white/20">
                        AI Avatar v1.0
                    </div>
                </Html>
            </group>
        </Float>
    );
}

export default function VirtualTrialScene({ lightingMode = 'daylight', showHeatmap = false }: SceneProps) {
    const envPreset = lightingMode === 'evening' ? 'night' : lightingMode === 'office' ? 'warehouse' : 'city';

    return (
        <div className="w-full h-full relative rounded-3xl overflow-hidden glass-panel">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={lightingMode === 'evening' ? 0.2 : 0.6} />
                <spotLight
                    position={[10, 10, 10]}
                    angle={0.15}
                    penumbra={1}
                    intensity={lightingMode === 'office' ? 1.5 : 1}
                    color={lightingMode === 'evening' ? '#bca6ff' : 'white'}
                />
                <pointLight position={[-10, -10, -10]} intensity={1} />

                <Avatar showHeatmap={showHeatmap} />

                <ContactShadows resolution={1024} scale={10} blur={2.5} opacity={0.5} far={10} color="#000000" />
                <OrbitControls enableZoom={true} minPolarAngle={Math.PI / 2.5} maxPolarAngle={Math.PI / 1.5} />
                <Environment preset={envPreset as any} />
            </Canvas>
        </div>
    );
}
