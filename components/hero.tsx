"use client";

import { AnimatePresence, motion } from "motion/react";
import { Copy, Check, Box } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ArtodeSymbol } from "@/components/artode-symbol";
import { usePackageNameContext } from "@/components/providers/package-name";
import { PACKAGE_MANAGER } from "@/constants";
import { getInstallCommand } from "@/lib/get-install-command";
import { CliBlock } from "@/components/cli-block";

const EXAMPLE_ICONS = ["archive", "activity", "github", "twitter", "heart", "camera", "cloud", "react", "vue-js", "next-js"];

export function Hero({ totalIcons }: { totalIcons: number }) {
    const { packageName, setPackageName } = usePackageNameContext();
    const [copied, setCopied] = useState(false);

    const installPrefix = getInstallCommand(packageName);
    const installCommand = `${installPrefix} artode-icons`;

    const handleCopy = () => {
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
                className="w-full flex justify-center mt-4 z-10"
            >
                <CliBlock icons={EXAMPLE_ICONS} />
            </motion.div>
        </section>
    );
}
