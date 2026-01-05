"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Fuse from "fuse.js";
import { ArtodeIcon } from "@/components/artode-icon";
import { Search, LayoutGrid, List, Command, Grid2X2, Copy, Terminal, Check, Sparkles } from "lucide-react";
import { useHotkeys } from "react-hotkeys-hook";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type IconData = [string, string]; // [name, path]

interface IconBrowserProps {
    allIcons: IconData[];
    categories: Record<string, string[]>;
}

const slugify = (name: string) => {
    if (name === "C#") return "csharp";
    if (name === "C++") return "cplusplus";
    return name
        .toLowerCase()
        .replace(/\./g, "-")
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");
};

import { SocialParticleCard } from "@/components/social-particle-card";

// Social Handles Map (Simulated)
const SOCIAL_PROFILES: Record<string, { username: string; url: string }> = {
    "X": { username: "@adhdpaws", url: "https://x.com/adhdpaws" },
    "Twitter": { username: "@adhdpaws", url: "https://x.com/adhdpaws" },
    "GitHub": { username: "@adhdpaws", url: "https://github.com/adhdpaws" },
    "LinkedIn": { username: "Artode", url: "https://linkedin.com/company/artode" },
    "Instagram": { username: "@artode_design", url: "https://instagram.com/artode_design" },
    "YouTube": { username: "@adhdpaws", url: "https://youtube.com/@adhdpaws" },
    "Twitch": { username: "@adhdpaws", url: "https://twitch.tv/adhdpaws" },
    "Reddit": { username: "u/adhdpaws", url: "https://reddit.com/user/adhdpaws" },
    // Defaults for others
};


export function IconBrowser({ allIcons, categories }: IconBrowserProps) {
    const [query, setQuery] = useState("");
    const [viewMode, setViewMode] = useState<"categories" | "grid">("grid");
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [isMac, setIsMac] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Tab state
    const [activeTab, setActiveTab] = useState<"all" | "socials">("all");

    useEffect(() => {
        setMounted(true);
        setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
    }, []);

    useHotkeys('mod+k', (e) => {
        e.preventDefault();
        searchInputRef.current?.focus();
    });

    const categoryIcons = useMemo(() => {
        if (activeTab === "all") return allIcons;
        const socialNames = new Set(categories["Social"] || []);
        return allIcons.filter(([name]) => socialNames.has(name));
    }, [activeTab, allIcons, categories]);

    const fuse = useMemo(() => new Fuse(categoryIcons, {
        keys: ["0"], // Search by name (index 0 of tuple)
        threshold: 0.3,
    }), [categoryIcons]);

    const filteredIcons = useMemo(() => {
        if (!query) return categoryIcons;
        return fuse.search(query).map(result => result.item);
    }, [query, categoryIcons, fuse]);

    // Derived state: Groups 
    const iconsByName = useMemo(() => {
        const map = new Map<string, string>();
        allIcons.forEach(([name, path]) => map.set(name, path));
        return map;
    }, [allIcons]);

    const displayGroups = useMemo(() => {
        if (viewMode === "grid") return null;

        const groups: Record<string, IconData[]> = {};
        const activeNames = new Set(filteredIcons.map(i => i[0]));

        Object.entries(categories).forEach(([cat, items]) => {
            const matches = items.filter(name => activeNames.has(name));
            if (matches.length > 0) {
                groups[cat] = matches.map(name => [name, iconsByName.get(name)!]);
            }
        });

        // "Other" category
        const categorizedNames = new Set(Object.values(categories).flat());
        const otherIcons = filteredIcons.filter(([name]) => !categorizedNames.has(name));

        if (otherIcons.length > 0) {
            groups["Other"] = otherIcons;
        }

        return groups;
    }, [viewMode, filteredIcons, categories, iconsByName]);

    return (
        <div className="w-full flex flex-col">
            {/* Toolbar */}
            <div className="w-full py-4 px-6 border-b border-secondary/10 bg-background/50 backdrop-blur sticky top-14 z-40 transition-all duration-300">
                <div className="w-full max-w-2xl mx-auto">
                    <div className="relative group w-full rounded-md bg-secondary/5 border border-secondary/10 shadow-sm transition-all focus-within:ring-1 focus-within:ring-primary/20 focus-within:bg-background focus-within:shadow-md hover:bg-secondary/10 hover:border-secondary/20">
                        <div className="flex items-center px-3 py-2 gap-3">
                            <Search className="w-4 h-4 text-secondary/50" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                }}
                                placeholder={`Search ${activeTab === 'socials' ? 'social icons' : 'icons'}...`}
                                className="flex-1 bg-transparent border-none outline-none font-sans text-sm text-foreground placeholder-secondary/40 h-9"
                            />
                            <div className="flex items-center gap-2 pl-2 border-l border-secondary/10">
                                <kbd className="hidden sm:flex h-5 items-center gap-0.5 rounded border border-secondary/20 bg-secondary/5 px-1.5 font-mono text-[9px] font-medium text-secondary/60">
                                    <span className="text-[10px]">{isMac ? '⌘' : 'Ctrl'}</span>K
                                </kbd>

                                <button
                                    onClick={() => setViewMode("categories")}
                                    className={cn(
                                        "p-2 rounded-md transition-all hover:bg-secondary/10",
                                        viewMode === "categories" ? "text-primary bg-primary/5" : "text-secondary/60"
                                    )}
                                    title="Grouped View"
                                >
                                    <List className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={cn(
                                        "p-2 rounded-md transition-all hover:bg-secondary/10 min-w-8", // added min-w for stability
                                        viewMode === "grid" ? "text-primary bg-primary/5" : "text-secondary/60"
                                    )}
                                    title="Grid View"
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                </button>

                                {/* Separator */}
                                <div className="w-px h-4 bg-secondary/10 mx-1" />

                                {/* Interactive Toggle */}
                                <div
                                    className="flex items-center gap-2 cursor-pointer group/toggle select-none pr-1"
                                    onClick={() => setActiveTab(activeTab === "all" ? "socials" : "all")}
                                >
                                    <span className={cn(
                                        "hidden sm:block text-[10px] uppercase font-mono tracking-wider font-medium transition-colors",
                                        activeTab === "socials" ? "text-primary" : "text-secondary/60"
                                    )}>
                                        Interactive
                                    </span>
                                    <div className={cn(
                                        "w-8 h-4 rounded-full transition-colors relative",
                                        activeTab === "socials" ? "bg-primary" : "bg-secondary/20 group-hover/toggle:bg-secondary/30"
                                    )}>
                                        <div className={cn(
                                            "absolute top-0.5 bottom-0.5 left-0.5 w-3 h-3 bg-background rounded-full shadow-sm transition-transform duration-200",
                                            activeTab === "socials" ? "translate-x-4" : "translate-x-0"
                                        )} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="w-full min-h-[50vh]">
                {filteredIcons.length === 0 ? (
                    <div className="text-center py-32 text-secondary/50 font-mono text-sm">
                        No icons found
                    </div>
                ) : viewMode === "grid" ? (
                    <div className="p-8 md:p-12">
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-x-8 gap-y-16 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            {filteredIcons.sort((a, b) => a[0].localeCompare(b[0])).map(([name, path]) => (
                                activeTab === "socials" ? (
                                    <SocialParticleCard
                                        key={name}
                                        name={name}
                                        path={path}
                                        username={SOCIAL_PROFILES[name]?.username || "@artode"}
                                        href={SOCIAL_PROFILES[name]?.url || "#"}
                                    />
                                ) : (
                                    <IconCard key={name} name={name} path={path} />
                                )
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {Object.entries(displayGroups || {}).map(([category, categoryIcons]) => (
                            <section key={category} className="flex flex-col border-b border-secondary/10 last:border-0" id={category.toLowerCase()}>
                                <div className="px-8 py-4 bg-secondary/5 border-b border-secondary/10 flex items-center justify-between">
                                    <h2 className="font-mono text-xs uppercase tracking-widest text-secondary font-medium">
                                        {category}
                                    </h2>
                                    <span className="font-mono text-[10px] text-secondary/40 bg-secondary/10 px-2 py-0.5 rounded-full">
                                        {categoryIcons.length}
                                    </span>
                                </div>
                                <div className="p-8 md:p-12 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-x-8 gap-y-16">
                                    {categoryIcons.sort((a, b) => a[0].localeCompare(b[0])).map(([name, path]) => (
                                        activeTab === "socials" ? (
                                            <SocialParticleCard
                                                key={name}
                                                name={name}
                                                path={path}
                                                username={SOCIAL_PROFILES[name]?.username || "@artode"}
                                                href={SOCIAL_PROFILES[name]?.url || "#"}
                                            />
                                        ) : (
                                            <IconCard key={name} name={name} path={path} />
                                        )
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper to map display names (e.g. "Vue.js") to registry component names (e.g. "vue-js")
const getRegistryName = (displayName: string) => {
    const map: Record<string, string> = {
        "C#": "csharp",
        "C++": "cplusplus",
        "Next.js": "next-js",
        "Node.js": "node-js",
        "Vue.js": "vue-js",
        "Nuxt.js": "nuxt-js",
        "VS Code": "vs-code",
        "Go": "go",
    };
    if (map[displayName]) return map[displayName];
    return displayName
        .toLowerCase()
        .replace(/\./g, "-")
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");
};


function CopyCodeAction({ name }: { name: string }) {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleCopy = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (status !== "idle" && status !== "error") return;

        try {
            setStatus("loading");
            const registryName = getRegistryName(name);
            const response = await fetch(`/r/${registryName}.json`);
            if (!response.ok) throw new Error("Failed");
            const data = await response.json();
            const content = data.files?.[0]?.content;

            if (content) {
                await navigator.clipboard.writeText(content);
                setStatus("success");
                toast.success(`Copied ${name} source`);
            } else {
                throw new Error("No content");
            }
        } catch (err) {
            console.error(err);
            await navigator.clipboard.writeText(`<ArtodeIcon name="${name}" />`);
            toast.error("Copied usage (source fetch failed)");
            setStatus("success");
        } finally {
            setTimeout(() => setStatus("idle"), 2000);
        }
    };

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    onClick={handleCopy}
                    className="flex items-center justify-center w-8 h-8 rounded-lg bg-background border border-secondary/10 text-secondary/60 hover:text-primary hover:border-primary/20 hover:shadow-sm transition-all shadow-sm active:scale-95"
                >
                    {status === "success" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
            </TooltipTrigger>
            <TooltipContent side="right">
                <p>Copy Source</p>
            </TooltipContent>
        </Tooltip>
    );
}

import { usePackageNameContext } from "@/components/providers/package-name";
import { getPackageManagerPrefix } from "@/lib/get-package-manager-prefix";

function CopyCLIAction({ name }: { name: string }) {
    const [status, setStatus] = useState<"idle" | "success">("idle");
    const { packageName } = usePackageNameContext();

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        const registryName = getRegistryName(name);

        const prefix = getPackageManagerPrefix(packageName);
        const command = `${prefix} shadcn@latest add @artode-icons/${registryName}`;

        navigator.clipboard.writeText(command);
        setStatus("success");
        toast.success(`Copied install command to clipboard`);
        setTimeout(() => setStatus("idle"), 2000);
    };

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    onClick={handleCopy}
                    className="flex items-center justify-center w-8 h-8 rounded-lg bg-background border border-secondary/10 text-secondary/60 hover:text-primary hover:border-primary/20 hover:shadow-sm transition-all shadow-sm active:scale-95"
                >
                    {status === "success" ? <Check className="w-4 h-4" /> : <Terminal className="w-4 h-4" />}
                </button>
            </TooltipTrigger>
            <TooltipContent side="right">
                <p>Add via CLI</p>
            </TooltipContent>
        </Tooltip>
    );
}

function IconCard({ name, path }: { name: string; path: string }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <TooltipProvider delayDuration={0}>
            <div
                className="flex flex-col items-center gap-4 group cursor-pointer relative z-0 hover:z-50 p-4"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="relative flex items-center justify-center">
                    <ArtodeIcon
                        path={path}
                        size={40}
                        forceHover={isHovered}
                        className="text-primary transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Hover Actions */}
                    <div className="absolute left-full top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ml-6 pointer-events-none group-hover:pointer-events-auto min-w-[40px]">
                        <CopyCodeAction name={name} />
                        <CopyCLIAction name={name} />
                    </div>
                </div>

                <span className="font-mono text-[10px] uppercase tracking-widest text-secondary/60 group-hover:text-primary transition-colors text-center max-w-[90px] truncate">
                    {name}
                </span>
            </div>
        </TooltipProvider>
    );
}
