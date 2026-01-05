"use client";

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { ArtodeIconProps } from './artode-icon';

export interface InteractiveArtodeIconProps extends ArtodeIconProps {
    /** 
     * Density of particles. 
     * 'low' = faster, good for large sizes. 
     * 'high' = clearer shape, more CPU.
     * Default depends on size.
     */
    particleDensity?: 'low' | 'medium' | 'high';
}

export const InteractiveArtodeIcon: React.FC<InteractiveArtodeIconProps> = ({
    path,
    size = 32,
    color = '#D80018',
    className,
    forceHover = false,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [internalHover, setInternalHover] = useState(false);
    const isHovered = forceHover || internalHover;

    const mouseRef = useRef({ x: size / 2, y: size / 2 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();

        // Scale to canvas coords
        let x = (e.clientX - rect.left) * (size / rect.width);
        let y = (e.clientY - rect.top) * (size / rect.height);

        // Clamp to keep mouse influence within bounds
        const padding = size * 0.1;
        x = Math.max(padding, Math.min(size - padding, x));
        y = Math.max(padding, Math.min(size - padding, y));

        mouseRef.current = { x, y };
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;

        // Resize canvas if needed
        if (canvas.width !== size * dpr) {
            canvas.width = size * dpr;
            canvas.height = size * dpr;
            canvas.style.width = `${size}px`;
            canvas.style.height = `${size}px`;
            ctx.scale(dpr, dpr);
        }

        // --- 1. Generate Points from Icon Path ---
        // Center icon initially
        const getIconPoints = () => {
            // We want the icon to take up most of the canvas but have some padding
            // Standard paths are 24x24 usually. We scale them up not to fill 100% (so particles have room to move)
            // We fit into 60% of size to allow swarm expansion without clipping
            const iconSize = size * 0.6;
            const px = (size - iconSize) / 2;
            const py = (size - iconSize) / 2;

            const tmp = document.createElement('canvas');
            tmp.width = size;
            tmp.height = size;
            const tCtx = tmp.getContext('2d');
            if (!tCtx) return [];

            const p = new Path2D(path);
            tCtx.save();
            tCtx.translate(px, py);
            const scale = iconSize / 24;
            tCtx.scale(scale, scale);
            tCtx.fillStyle = '#000';
            tCtx.fill(p, "evenodd");
            tCtx.restore();

            const data = tCtx.getImageData(0, 0, size, size).data;
            const pts = [];

            // Optimization: Adjust step based on size to keep particle count reasonable 
            let step = 1;
            // Heuristic for step size to avoid > 4000 particles
            if (size > 64) step = 2;
            if (size > 200) step = 3;

            for (let y = 0; y < size; y += step) {
                for (let x = 0; x < size; x += step) {
                    if (data[(y * size + x) * 4 + 3] > 80) pts.push({ x, y });
                }
            }
            return pts;
        };

        const ptsA = getIconPoints();

        // Particles
        let particles = Array.from({ length: ptsA.length }).map((_, i) => ({
            x: ptsA[i].x,
            y: ptsA[i].y,
            homeA: ptsA[i],
            speed: 0.02 + Math.random() * 0.04,
            friction: 0.9 + Math.random() * 0.05,
        }));

        let animId: number;
        const render = () => {
            ctx.clearRect(0, 0, size, size);
            ctx.fillStyle = color;

            if (isHovered) {
                // Swarm towards mouse
                particles.forEach(p => {
                    const target = mouseRef.current;
                    const dx = target.x - p.x;
                    const dy = target.y - p.y;

                    p.x += dx * p.speed;
                    p.y += dy * p.speed;

                    // Size of particle
                    const s = size > 64 ? 2 : 1.5;
                    ctx.fillRect(p.x, p.y, s, s);
                });
            } else {
                // Go Home
                particles.forEach(p => {
                    const target = p.homeA;
                    const dx = target.x - p.x;
                    const dy = target.y - p.y;

                    p.x += dx * (p.speed * 0.5); // Slower return
                    p.y += dy * (p.speed * 0.5);

                    const s = size > 64 ? 2 : 1.5;
                    ctx.fillRect(p.x, p.y, s, s);
                });
            }

            animId = requestAnimationFrame(render);
        };
        render();

        return () => {
            if (animId) cancelAnimationFrame(animId);
        };
    }, [path, size, color, isHovered]);

    return (
        <canvas
            ref={canvasRef}
            className={cn("cursor-none", className)} // Hide cursor is optional, but feels better for interaction
            onMouseEnter={() => setInternalHover(true)}
            onMouseLeave={() => setInternalHover(false)}
            onMouseMove={handleMouseMove}
            style={{ width: size, height: size }}
        />
    );
};
