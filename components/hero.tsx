"use client";

import { AnimatePresence, motion } from "motion/react";
import { Copy, Check, Box } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ArtodeSymbol } from "@/components/artode-symbol";
import { usePackageNameContext } from "@/components/providers/package-name";
import { PACKAGE_MANAGER } from "@/constants";
import { getPackageManagerPrefix } from "@/lib/get-package-manager-prefix";

const EXAMPLE_ICONS = ["archive", "activity", "github", "twitter", "heart", "camera", "cloud"];

export function Hero({ totalIcons }: { totalIcons: number }) {
    const { packageName, setPackageName } = usePackageNameContext();
    const [copied, setCopied] = useState(false);
    const [iconIndex, setIconIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIconIndex((prev) => (prev + 1) % EXAMPLE_ICONS.length);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const prefix = getPackageManagerPrefix(packageName);
    const currentIcon = EXAMPLE_ICONS[iconIndex];

    const handleCopy = () => {
        const installCommand = `${prefix} shadcn@latest add @artode/${currentIcon}`;
        navigator.clipboard.writeText(installCommand);
        setCopied(true);
        toast.success("Command copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="flex flex-col items-center gap-8 py-20 px-4 border-b border-secondary/10 relative overflow-hidden min-h-[500px] justify-center">
            {/* Background Particle Layer */}
            <ArtodeSymbol
                className="absolute inset-0 z-0 pointer-events-none"
                anchorId="artode-symbol-anchor"
            />

            <div className="flex flex-col items-center gap-6 text-center z-10 w-full max-w-4xl mx-auto">
                {/* Spacer for the Symbol */}
                <div id="artode-symbol-anchor" className="w-20 h-20" aria-hidden="true" />

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="font-mono text-xs tracking-[0.2em] text-foreground/80 uppercase max-w-md leading-relaxed"
                >
                    Kinetic Interference Icons // {totalIcons} Glyphs
                    <br />
                    <span className="opacity-70 text-[10px] normal-case tracking-normal block mt-2">
                        Generative particle motion for modern interfaces. A curated collection of smooth, art-driven animated glyphs.
                    </span>
                </motion.p>

                {/* Brand Badge */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center gap-2 text-[10px] font-mono text-foreground/60 bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20"
                >
                    <span>A Fusion of</span>
                    <span className="text-foreground/80">Art</span>
                    <span>&</span>
                    <span className="text-foreground/80">Code</span>
                </motion.div>
            </div>

            {/* Install Box */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="w-full max-w-lg mt-4 z-10"
            >
                <div className="flex items-center justify-center gap-1 mb-2">
                    {Object.values(PACKAGE_MANAGER).map((pm) => (
                        <button
                            key={pm}
                            onClick={() => setPackageName(pm)}
                            className={cn(
                                "px-3 py-1 text-[10px] font-mono rounded-t-md border-t border-x transition-colors",
                                packageName === pm
                                    ? "bg-background border-secondary/10 text-primary z-10 -mb-px border-b-background pb-1.5"
                                    : "bg-secondary/5 border-transparent text-secondary/40 hover:text-secondary hover:bg-secondary/10"
                            )}
                        >
                            {pm}
                        </button>
                    ))}
                </div>

                <div className="relative group rounded-md bg-secondary/5 border border-secondary/10 p-4 font-mono text-xs text-secondary/80 flex items-center justify-center hover:border-secondary/20 transition-colors">
                    <div className="flex items-center truncate">
                        <span className="text-secondary/60">{prefix} shadcn@latest add @artode/</span>
                        <div className="relative h-4 min-w-[60px]">
                            <AnimatePresence mode="popLayout">
                                <motion.span
                                    key={currentIcon}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className="absolute left-0 top-0 text-primary font-bold"
                                >
                                    {currentIcon}
                                </motion.span>
                            </AnimatePresence>
                        </div>
                    </div>
                    <button
                        onClick={handleCopy}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-secondary/10 text-secondary/40 hover:text-primary transition-colors"
                    >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                </div>
            </motion.div>
        </section>
    );
}
