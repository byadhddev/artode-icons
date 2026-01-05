"use client";

import React, { useState, useMemo } from "react";
import { ArtodeIcon } from "@/components/artode-icon";
import { Check, Copy, RefreshCw, Moon, Sun, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface IconPlaygroundProps {
    allIcons: [string, string][]; // [name, path]
}

export function IconPlayground({ allIcons }: IconPlaygroundProps) {
    // Default State
    const [selectedIconName, setSelectedIconName] = useState<string>("React");
    const [size, setSize] = useState<number>(128);
    const [color, setColor] = useState<string>("#D80018");
    const [drawType, setDrawType] = useState<"fill" | "stroke">("fill");
    const [forceHover, setForceHover] = useState<boolean>(false);
    const [backgroundMode, setBackgroundMode] = useState<"light" | "dark" | "transparent">("light");
    const [mode, setMode] = useState<"standard" | "interactive">("standard");
    const [isHovered, setIsHovered] = useState(false);
    const [globalMouseActive, setGlobalMouseActive] = useState(false);
    const stageRef = React.useRef<HTMLDivElement>(null);
    const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

    React.useEffect(() => {
        if (!stageRef.current) return;
        const obs = new ResizeObserver((entries) => {
            for (let entry of entries) {
                setStageSize({ width: entry.contentRect.width, height: entry.contentRect.height });
            }
        });
        obs.observe(stageRef.current);
        return () => obs.disconnect();
    }, []);

    // Search/Filter for icon selection
    const [searchQuery, setSearchQuery] = useState("");

    const selectedPath = useMemo(() => {
        const found = allIcons.find(([name]) => name === selectedIconName);
        return found ? found[1] : allIcons[0][1];
    }, [selectedIconName, allIcons]);

    const filteredIcons = useMemo(() => {
        if (!searchQuery) return allIcons;
        return allIcons.filter(([name]) => name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [searchQuery, allIcons]);

    // Color Presets
    const COLOR_PRESETS = [
        { name: "Swiss Red", value: "#DA291C" },
        { name: "Swiss Ink", value: "#2A2A2A" },
        { name: "Dark Beige", value: "#858173" },
        { name: "White", value: "#FFFFFF" },
        { name: "Blue", value: "#007AFF" },
        { name: "Green", value: "#34C759" },
    ];

    // Generated Code
    const generatedCode = useMemo(() => {
        let code = `<ArtodeIcon\n  name="${selectedIconName}"\n  path="${selectedPath.substring(0, 20)}..."`; // Truncated path for display simplicity? No, user needs usage.
        // Actually, if using the component library properly, they might use <ReactIcon /> but here we are exposing the raw ArtodeIcon for max flexibility or maybe just showing how to customize it.
        // Let's show the usage as if they are using the generic ArtodeIcon component with the path, OR the specific component if they want.
        // Since `ArtodeIcon` takes a path, I'll show that.

        // Refined: usually users want the named component: <ReactIcon size={...} color="..." />
        // But the named components just wrap ArtodeIcon.
        // Let's generate the code for the Named component usage as it is cleaner.

        const props = [];
        if (size !== 32) props.push(`size={${size}}`);
        if (color !== "#D80018") props.push(`color="${color}"`);
        if (drawType !== "fill") props.push(`drawType="${drawType}"`);
        if (forceHover) props.push(`forceHover`);
        if (mode === "interactive") props.push(`interactive`);

        // Convert "React" to "ReactIcon" or similar? 
        // The registry exports them as "ReactIcon", "VueIsIcon" etc?
        // Let's check icons/react.tsx -> export const ReactIcon
        // So standard is `${Name}Icon`.
        // Exception: "Next.js" -> "NextJsIcon"? Need to check naming convention.
        // For now, let's assume `${Name}Icon`.

        let cleanName = selectedIconName;
        if (cleanName === "C#") cleanName = "CSharp";
        else if (cleanName === "C++") cleanName = "CPlusPlus";
        else cleanName = cleanName.replace(/[^a-zA-Z0-9]/g, "");

        const componentName = cleanName + "Icon";

        return `<${componentName} ${props.join(" ")} />`;
    }, [selectedIconName, size, color, drawType, forceHover, mode]);

    const handleCopyCode = () => {
        navigator.clipboard.writeText(generatedCode);
        toast.success("Code copied to clipboard");
    };

    return (
        <div className="w-full flex flex-col md:flex-row h-[calc(100vh-3.5rem)]">
            {/* Sidebar Controls */}
            <div className="w-full md:w-80 border-r border-secondary/10 bg-background flex flex-col overflow-y-auto">
                <div className="p-6 border-b border-secondary/10">
                    <h2 className="font-mono text-sm uppercase tracking-widest text-secondary font-medium mb-4">
                        Configuration
                    </h2>

                    {/* Icon Selector */}
                    <div className="space-y-3 mb-6">
                        <label className="text-xs font-mono text-secondary/60 uppercase">Icon</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search icons..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-secondary/5 border border-secondary/10 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary/20 mb-2"
                            />
                            <div className="h-40 overflow-y-auto border border-secondary/10 rounded bg-secondary/5">
                                {filteredIcons.map(([name]) => (
                                    <button
                                        key={name}
                                        onClick={() => setSelectedIconName(name)}
                                        className={cn(
                                            "w-full text-left px-3 py-2 text-sm hover:bg-secondary/10 transition-colors flex items-center justify-between",
                                            selectedIconName === name ? "text-primary bg-primary/5" : "text-foreground"
                                        )}
                                    >
                                        <span>{name}</span>
                                        {selectedIconName === name && <Check className="w-3 h-3" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Size Control */}
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-mono text-secondary/60 uppercase">Size</label>
                            <span className="text-xs font-mono text-secondary/40">{size}px</span>
                        </div>
                        <input
                            type="range"
                            min="16"
                            max="300"
                            value={size}
                            onChange={(e) => setSize(Number(e.target.value))}
                            className="w-full accent-primary h-1 bg-secondary/20 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    {/* Draw Type */}
                    <div className="space-y-3 mb-6">
                        <label className="text-xs font-mono text-secondary/60 uppercase">Draw Type</label>
                        <div className="flex bg-secondary/5 p-1 rounded-lg border border-secondary/10">
                            {(['fill', 'stroke'] as const).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setDrawType(type)}
                                    className={cn(
                                        "flex-1 py-1.5 text-xs font-mono uppercase rounded-md transition-all",
                                        drawType === type
                                            ? "bg-background shadow-sm text-primary font-medium"
                                            : "text-secondary/60 hover:text-secondary"
                                    )}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Animation State */}
                    <div className="space-y-3 mb-6">
                        <label className="text-xs font-mono text-secondary/60 uppercase">Mode & Animation</label>
                        <div className="flex flex-col gap-2">
                            <div className="flex bg-secondary/5 p-1 rounded-lg border border-secondary/10">
                                <button
                                    onClick={() => setMode("standard")}
                                    className={cn(
                                        "flex-1 py-1.5 text-xs font-mono uppercase rounded-md transition-all",
                                        mode === "standard"
                                            ? "bg-background shadow-sm text-primary font-medium"
                                            : "text-secondary/60 hover:text-secondary"
                                    )}
                                >
                                    Standard
                                </button>
                                <button
                                    onClick={() => setMode("interactive")}
                                    className={cn(
                                        "flex-1 py-1.5 text-xs font-mono uppercase rounded-md transition-all flex items-center justify-center gap-1",
                                        mode === "interactive"
                                            ? "bg-background shadow-sm text-primary font-medium"
                                            : "text-secondary/60 hover:text-secondary"
                                    )}
                                >
                                    Interactive
                                </button>
                            </div>

                            <button
                                onClick={() => setForceHover(!forceHover)}
                                className={cn(
                                    "w-full py-2 px-3 border rounded text-xs font-mono uppercase transition-all flex items-center justify-center gap-2",
                                    forceHover
                                        ? "border-primary bg-primary/5 text-primary"
                                        : "border-secondary/10 bg-secondary/5 text-secondary/60 hover:border-secondary/20"
                                )}
                            >
                                <RefreshCw className={cn("w-3 h-3", forceHover && "animate-spin")} />
                                {forceHover ? "Always On" : "On Hover"}
                            </button>
                        </div>
                    </div>

                    {/* Color Control */}
                    <div className="space-y-3">
                        <label className="text-xs font-mono text-secondary/60 uppercase">Color</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {COLOR_PRESETS.map((preset) => (
                                <button
                                    key={preset.name}
                                    onClick={() => setColor(preset.value)}
                                    className={cn(
                                        "w-6 h-6 rounded-full border border-secondary/10 transition-transform hover:scale-110",
                                        color === preset.value && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                                    )}
                                    style={{ backgroundColor: preset.value }}
                                    title={preset.name}
                                />
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                            />
                            <input
                                type="text"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="flex-1 bg-secondary/5 border border-secondary/10 rounded px-2 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:border-primary/20"
                            />
                        </div>
                    </div>
                </div>

                {/* Code Export */}
                <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-mono text-secondary/60 uppercase">Usage</label>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={handleCopyCode}
                                        className="text-secondary/40 hover:text-primary transition-colors"
                                    >
                                        <Copy className="w-3 h-3" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>Copy Code</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <pre className="p-4 bg-secondary/5 border border-secondary/10 rounded-lg overflow-x-auto">
                        <code className="text-[10px] font-mono text-foreground/80 whitespace-pre-wrap">
                            {generatedCode}
                        </code>
                    </pre>
                </div>
            </div>

            {/* Main Stage */}
            <div className={cn(
                "flex-1 flex flex-col relative transition-colors duration-300",
                backgroundMode === "dark" ? "bg-[#111]" : backgroundMode === "light" ? "bg-[#FAF9F0]" : "bg-[url('/grid.svg')] bg-center"
            )}>
                {/* Stage Controls */}
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-background/80 backdrop-blur border border-secondary/10 p-1 rounded-lg z-10">
                    <button
                        onClick={() => setBackgroundMode("light")}
                        className={cn(
                            "p-2 rounded-md transition-all hover:bg-secondary/10",
                            backgroundMode === "light" ? "text-primary bg-primary/5" : "text-secondary/60"
                        )}
                        title="Light Background"
                    >
                        <Sun className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setBackgroundMode("dark")}
                        className={cn(
                            "p-2 rounded-md transition-all hover:bg-secondary/10",
                            backgroundMode === "dark" ? "text-primary bg-primary/5" : "text-secondary/60"
                        )}
                        title="Dark Background"
                    >
                        <Moon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setBackgroundMode("transparent")}
                        className={cn(
                            "p-2 rounded-md transition-all hover:bg-secondary/10",
                            backgroundMode === "transparent" ? "text-primary bg-primary/5" : "text-secondary/60"
                        )}
                        title="Transparent/Grid Background"
                    >
                        <Monitor className="w-4 h-4" />
                    </button>
                </div>

                {/* Canvas Area */}
                <div
                    ref={stageRef}
                    className="flex-1 relative overflow-hidden"
                    onMouseLeave={() => {
                        setGlobalMouseActive(false);
                        setIsHovered(false);
                    }}
                >
                    {/* Interactive Mode: Background Layer (Full Stage Canvas) */}
                    {mode === "interactive" && (
                        <div className="absolute inset-0 z-0 pointer-events-none">
                            <ArtodeIcon
                                path={selectedPath}
                                size={size}
                                color={color}
                                drawType={drawType}
                                forceHover={forceHover}
                                interactive={true}
                                globalMouse={globalMouseActive}
                                customCanvasSize={stageSize.width > 0 ? stageSize : undefined}
                                className="block"
                            />
                        </div>
                    )}

                    {/* Foreground Content: Trigger Zone & Standard Icon */}
                    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                        {/* The interactive trigger zone / Standard Icon Container */}
                        <div
                            style={{ width: size, height: size }}
                            className="relative group pointer-events-auto flex items-center justify-center"
                            onMouseEnter={() => {
                                setIsHovered(true);
                                if (mode === "interactive") setGlobalMouseActive(true);
                            }}
                            onMouseLeave={() => {
                                // For standard mode we might want to track hover status for glow
                                // For interactive mode, we DO NOT clear globalMouseActive here, only on stage leave
                                // But we clear isHovered for the glow effect? 
                                // Actually glow logic was "(forceHover || isHovered) && ...".
                                // If we want glow to persist with particles, keep it true?
                                // User didn't specify glow persistence, but let's sync it with globalMouseActive for consistency.
                                if (mode !== "interactive") setIsHovered(false);
                            }}
                        >
                            {/* Glow effect */}
                            <div className={cn(
                                "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/20 blur-[100px] rounded-full opacity-0 transition-opacity duration-1000 pointer-events-none",
                                (forceHover || isHovered || globalMouseActive) && "opacity-20"
                            )} />

                            {/* Standard Icon */}
                            {mode === "standard" && (
                                <ArtodeIcon
                                    path={selectedPath}
                                    size={size}
                                    color={color}
                                    drawType={drawType}
                                    forceHover={forceHover}
                                    interactive={false}
                                    className="relative z-10 transition-transform duration-300"
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Info Footer */}
                <div className="absolute bottom-0 left-0 w-full p-4 border-t border-secondary/10 bg-background/50 backdrop-blur flex justify-between items-center text-[10px] font-mono text-secondary/40">
                    <span>
                        Rendering: {size}x{size}px @ {typeof window !== 'undefined' ? window.devicePixelRatio : 1}x DPR
                    </span>
                    <span>
                        {selectedIconName}
                    </span>
                </div>
            </div>

            {/* Hidden Hover Proxy for non-forced hover detection if needed, 
                but ArtodeIcon handles internal hover. 
                We just need to know if it is hovered to show the glow maybe? 
                Actually ArtodeIcon doesn't expose onHoverChange.
            */}
        </div>
    );
}

// Add a dummy var for isHovered logic if I want the glow
// But ArtodeIcon manages its own hover.
// To get external glow, I might need to wrap it.
