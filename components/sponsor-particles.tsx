"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArtodeIcon } from "@/components/artode-icon";
import { cn } from "@/lib/utils";

// Standard Heart Path (Lucide/Feather)
const heartPath = "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z";

const ParticleText = ({ isHovered }: { isHovered: boolean }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [showCanvas, setShowCanvas] = useState(false);

    useEffect(() => {
        if (isHovered) {
            setShowCanvas(true);
        } else {
            const t = setTimeout(() => setShowCanvas(false), 500);
            return () => clearTimeout(t);
        }
    }, [isHovered]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const width = 180; // Increased width to prevent text clipping
        const height = 24; // Increased height for safety

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.scale(dpr, dpr);

        // Robust font stack for consistent rendering on Mac/Safari
        const font = "500 12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";

        // Helper
        const getPoints = (text: string) => {
            const tmp = document.createElement('canvas');
            tmp.width = width;
            tmp.height = height;
            const tCtx = tmp.getContext('2d');
            if (!tCtx) return [];
            tCtx.font = font;
            tCtx.textBaseline = 'middle';
            tCtx.textAlign = 'center';
            tCtx.fillStyle = '#fff';
            tCtx.fillText(text, width / 2, height / 2);

            const data = tCtx.getImageData(0, 0, width, height).data;
            const pts = [];

            // Scan with finer resolution (y+=1) to catch details like "<3"
            for (let y = 0; y < height; y += 1) {
                for (let x = 0; x < width; x += 1) {
                    // Lower threshold to catch anti-aliased pixels in Safari
                    if (data[(y * width + x) * 4 + 3] > 20) pts.push({ x, y });
                }
            }
            return pts;
        };

        const ptsA = getPoints("Sponsor Project");
        const ptsB = getPoints("Fuel the Art <3");

        let particles = Array.from({ length: Math.max(ptsA.length, ptsB.length) }).map((_, i) => ({
            x: ptsA[i % ptsA.length]?.x || width / 2,
            y: ptsA[i % ptsA.length]?.y || height / 2,
            homeA: ptsA[i % ptsA.length] || { x: width / 2, y: height / 2 },
            homeB: ptsB[i] || ptsB[Math.floor(Math.random() * ptsB.length)],
        }));

        let animId: number;
        const render = () => {
            ctx.clearRect(0, 0, width, height);

            ctx.fillStyle = isHovered ? '#D80018' : '#71717a';

            particles.forEach(p => {
                const target = isHovered ? p.homeB : p.homeA;

                const dx = target.x - p.x;
                const dy = target.y - p.y;

                p.x += dx * 0.1;
                p.y += dy * 0.1;

                ctx.fillRect(p.x, p.y, 1.5, 1.5);
            });

            animId = requestAnimationFrame(render);
        };
        render();

        return () => cancelAnimationFrame(animId);
    }, [isHovered, showCanvas]);

    return (
        <div className="relative flex items-center justify-center">
            {/* Normal Text Layer - In Flow to reserve width */}
            <span
                className={cn(
                    "text-xs font-mono text-secondary whitespace-nowrap transition-opacity duration-300",
                    isHovered ? "opacity-0" : "opacity-100"
                )}
            >
                Sponsor Project
            </span>

            {/* Canvas Layer - Absolute Overlay */}
            {showCanvas && (
                <canvas
                    ref={canvasRef}
                    className={cn(
                        "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-300",
                        isHovered ? "opacity-100" : "opacity-0"
                    )}
                />
            )}
        </div>
    );
};

export const SponsorParticles: React.FC = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Link
            href="https://github.com/sponsors/adhdpaws"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 relative h-6"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <ArtodeIcon
                path={heartPath}
                size={16}
                color={isHovered ? '#D80018' : '#71717a'}
                forceHover={isHovered}
                className="transition-colors duration-300"
            />
            <ParticleText isHovered={isHovered} />
        </Link>
    );
};
