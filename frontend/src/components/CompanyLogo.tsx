"use client";

import Image from "next/image";

export default function CompanyLogo() {
    return (
        <div className="fixed bottom-1 left-1/2 transform -translate-x-1/2 z-40">
            <Image
                src="/logo.jpg"
                alt="Aibotics"
                width={180}
                height={50}
                className="opacity-90"
                priority
            />
        </div>
    );
}
