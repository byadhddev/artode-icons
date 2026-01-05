"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArtodeIcon } from "@/components/artode-icon";
import { cn } from "@/lib/utils";

interface SocialParticleCardProps {
    name: string;
    path: string;
    username: string;
    href: string;
}

export const SocialParticleCard: React.FC<SocialParticleCardProps> = ({
    name,
    path,
    username,
    href
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Dimensions
    const canvasWidth = 160; // Wider canvas to fit text/swarm area
    const canvasHeight = 64;

    const mouseRef = useRef({ x: canvasWidth / 2, y: canvasHeight / 2 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();

        // Scale to canvas coords
        let x = (e.clientX - rect.left) * (canvasWidth / rect.width);
        let y = (e.clientY - rect.top) * (canvasHeight / rect.height);

        // Clamp to keep particles within bounds (with padding)
        x = Math.max(20, Math.min(canvasWidth - 20, x));
        y = Math.max(20, Math.min(canvasHeight - 20, y));

        mouseRef.current = { x, y };
    };

    const handleMouseEnter = (e: React.MouseEvent) => {
        setIsHovered(true);
        // Initialize mouse ref immediately to avoid jump
        handleMouseMove(e);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = canvasWidth * dpr;
        canvas.height = canvasHeight * dpr;
        canvas.style.width = `${canvasWidth}px`;
        canvas.style.height = `${canvasHeight}px`;
        ctx.scale(dpr, dpr);

        // --- 1. Generate Points from Icon Path ---
        // Center icon initially
        const getIconPoints = () => {
            const px = canvasWidth / 2 - 20;
            const py = canvasHeight / 2 - 20;

            const tmp = document.createElement('canvas');
            tmp.width = canvasWidth;
            tmp.height = canvasHeight;
            const tCtx = tmp.getContext('2d');
            if (!tCtx) return [];

            const p = new Path2D(path);
            tCtx.save();
            tCtx.translate(px, py);
            tCtx.scale(40 / 24, 40 / 24);
            tCtx.fillStyle = '#000';
            tCtx.fill(p, "evenodd");
            tCtx.restore();

            const data = tCtx.getImageData(0, 0, canvasWidth, canvasHeight).data;
            const pts = [];
            // Fine scan for dense, tiny particles
            for (let y = 0; y < canvasHeight; y += 1) {
                for (let x = 0; x < canvasWidth; x += 1) {
                    if (data[(y * canvasWidth + x) * 4 + 3] > 80) pts.push({ x, y });
                }
            }
            return pts;
        };

        const ptsA = getIconPoints();

        // Particles with randomized traits for organic movement
        let particles = Array.from({ length: ptsA.length }).map((_, i) => ({
            x: ptsA[i].x,
            y: ptsA[i].y,
            homeA: ptsA[i],
            speed: 0.001 + Math.random() * 0.002, // 20x Slower speed
            friction: 0.9 + Math.random() * 0.05, // Varied friction
        }));

        let animId: number;
        const render = () => {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);

            ctx.fillStyle = isHovered ? '#D80018' : '#71717a';

            particles.forEach(p => {
                const target = isHovered ? mouseRef.current : p.homeA;

                const dx = target.x - p.x;
                const dy = target.y - p.y;

                // Use individual speed for organic swarm effect
                p.x += dx * p.speed;
                p.y += dy * p.speed;

                // Tiny particles for dense look
                const s = isHovered ? 1.0 : 0.8;
                ctx.fillRect(p.x, p.y, s, s);
            });

            animId = requestAnimationFrame(render);
        };
        render();

        return () => cancelAnimationFrame(animId);
    }, [path, username, isHovered]);

    return (
        <Link
            href={href}
            target="_blank"
            className="flex flex-col items-center justify-center gap-4 relative w-full h-32 group"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={handleMouseMove}
        >
            <div className="relative flex items-center justify-center w-full h-16">
                {/* Default Static Icon - Fades out on hover */}
                <ArtodeIcon
                    path={path}
                    size={40}
                    forceHover={false}
                    className={cn(
                        "text-primary transition-opacity duration-300 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
                        isHovered ? "opacity-0" : "opacity-100"
                    )}
                />

                {/* Particle Canvas */}
                <canvas
                    ref={canvasRef}
                    className={cn(
                        "pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300",
                        isHovered ? "opacity-100" : "opacity-0"
                    )}
                />

                {/* Popup Tooltip - Static Center */}
                <div
                    className={cn(
                        "absolute bottom-full mb-2 flex flex-col items-center transition-all duration-300 transform pointer-events-none z-10",
                        isHovered ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95"
                    )}
                >
                    <div className="bg-foreground text-background text-xs font-mono font-medium px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap relative">
                        {username}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground rotate-45 transform"></div>
                    </div>
                </div>
            </div>

            {/* Label - Standard name below (e.g. X, Twitter) */}
            <span className={cn(
                "font-mono text-[10px] uppercase tracking-widest text-secondary/60 transition-opacity duration-300",
                isHovered ? "opacity-50" : "opacity-100"
            )}>
                {name}
            </span>
        </Link>
    );
};
