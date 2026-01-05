"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { PACKAGE_MANAGER } from "@/constants";

type PackageManager = (typeof PACKAGE_MANAGER)[keyof typeof PACKAGE_MANAGER];

type PackageNameContextType = {
    packageName: PackageManager;
    setPackageName: (packageName: PackageManager) => void;
};

const PackageNameContext = createContext<PackageNameContextType>({
    packageName: PACKAGE_MANAGER.NPM, // Default to NPM for broader compatibility if not set
    setPackageName: () => { },
});

const PackageNameProvider = ({ children }: { children: React.ReactNode }) => {
    const [packageName, setPackageName] = useState<PackageManager>(PACKAGE_MANAGER.NPM);

    // Optional: Persist in local storage
    useEffect(() => {
        const saved = localStorage.getItem("package-manager") as PackageManager;
        if (saved && Object.values(PACKAGE_MANAGER).includes(saved)) {
            setPackageName(saved);
        }
    }, []);

    const updatePackageName = (name: PackageManager) => {
        setPackageName(name);
        localStorage.setItem("package-manager", name);
    };

    return (
        <PackageNameContext.Provider value={{ packageName, setPackageName: updatePackageName }}>
            {children}
        </PackageNameContext.Provider>
    );
};

const usePackageNameContext = () => {
    const context = useContext(PackageNameContext);
    if (!context) {
        throw new Error("usePackageNameContext must be used within a PackageNameProvider");
    }
    return context;
};

export { PackageNameProvider, usePackageNameContext };
