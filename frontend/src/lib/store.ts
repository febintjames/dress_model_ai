import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type UserProfile = {
    gender: 'female' | 'male' | 'non-binary' | null;
    ageRange: string | null;
    skinTone: string | null;
    measurements: {
        shoulder: number;
        waist: number;
        hip: number;
    } | null;
};

type KioskState = {
    // Stage Management
    currentStage: number;
    setStage: (stage: number) => void;

    // Accessibility
    accessibilityMode: boolean;
    toggleAccessibility: () => void;

    // User Data
    userProfile: UserProfile;
    updateProfile: (data: Partial<UserProfile>) => void;

    // Selected Product from Selection Page
    selectedProduct: any | null;
    setSelectedProduct: (product: any) => void;

    // Shopping
    cart: any[];
    addToCart: (item: any) => void;
    removeFromCart: (itemId: string) => void;

    // Hardware Status
    isScanning: boolean;
    setIsScanning: (status: boolean) => void;
};

export const useKioskStore = create<KioskState>()(
    persist(
        (set) => ({
            currentStage: 0,
            setStage: (stage) => set({ currentStage: stage }),

            accessibilityMode: false,
            toggleAccessibility: () => set((state) => ({ accessibilityMode: !state.accessibilityMode })),

            userProfile: { gender: null, ageRange: null, skinTone: null, measurements: null },
            updateProfile: (data) => set((state) => ({ userProfile: { ...state.userProfile, ...data } })),

            selectedProduct: null,
            setSelectedProduct: (product) => set({ selectedProduct: product }),

            cart: [],
            addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),
            removeFromCart: (id) => set((state) => ({ cart: state.cart.filter((i) => i.id !== id) })),

            isScanning: false,
            setIsScanning: (status) => set({ isScanning: status }),
        }),
        {
            name: 'kiosk-storage', // Storage key
            storage: createJSONStorage(() => sessionStorage), // Use sessionStorage for session-based persistence
        }
    )
);
