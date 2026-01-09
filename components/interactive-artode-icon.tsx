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
    /**
     * If true, tracks mouse globally (window) instead of just within canvas.
     */
    globalMouse?: boolean;
    /**
     * Optional custom canvas dimensions. 
     * If provided, the canvas will be this size, but the icon will remain 'size' pixels and centered.
     * Useful for allowing particles to spread into a larger area (e.g. playground).
     */
    customCanvasSize?: { width: number; height: number };
}

export const InteractiveArtodeIcon: React.FC<InteractiveArtodeIconProps> = ({
    path,
    size = 32,
    color = 'currentColor',
    className,
    forceHover = false,
    globalMouse = false,
    customCanvasSize,
    viewBoxSize = 24
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [internalHover, setInternalHover] = useState(false);
    const [resolvedColor, setResolvedColor] = useState(color === 'currentColor' ? '#D80018' : color);
    const isHovered = forceHover || internalHover || globalMouse; // Global mouse implies always active tracking

    const width = customCanvasSize?.width ?? size;
    const height = customCanvasSize?.height ?? size;

    // Resolve 'currentColor' from the parent element's computed style
    useEffect(() => {
        if (color !== 'currentColor') {
            setResolvedColor(color);
            return;
        }
        const canvas = canvasRef.current;
        if (!canvas) return;

        const computedColor = window.getComputedStyle(canvas).color;
        setResolvedColor(computedColor || '#D80018');
    }, [color, className]);

    // Use ref for isHovered to avoid effect re-triggering and hard resets
    const isHoveredRef = useRef(isHovered);
    useEffect(() => {
        isHoveredRef.current = isHovered;
    }, [isHovered]);

    const mouseRef = useRef({ x: width / 2, y: height / 2 });

    const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();

        // Scale to canvas coords
        let x = (e.clientX - rect.left) * (width / rect.width);
        let y = (e.clientY - rect.top) * (height / rect.height);

        // Clamp to keep mouse influence within bounds
        const padding = size * 0.1;

        // If global mouse, we don't clamp strictly to canvas, but we might want to clamp interaction radius?
        // Actually user said "entire playground white space wherever the cursor is it should be acting"
        // This implies the target can be outside the canvas.

        // Always clamp the target point to be within the canvas bounds.
        // This ensures that even if the mouse is outside (global tracking),
        // the particles 'swarm' towards the edge nearest the mouse but don't disappear off-canvas.
        x = Math.max(padding, Math.min(width - padding, x));
        y = Math.max(padding, Math.min(height - padding, y));

        mouseRef.current = { x, y };
    };

    useEffect(() => {
        if (globalMouse) {
            setInternalHover(false); // Reset internal hover so state depends purely on globalMouse
            window.addEventListener('mousemove', handleMouseMove);
            return () => window.removeEventListener('mousemove', handleMouseMove);
        }
    }, [globalMouse, width, height]); // Re-bind if size changes as handleMouseMove depends on it? ideally use ref for size or callback


    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;

        // Resize canvas if needed
        // Check both dimensions
        if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.scale(dpr, dpr);
        }

        // --- 1. Generate Points from Icon Path ---
        // Center icon initially
        const getIconPoints = () => {
            // We want the icon to be 'size' pixels large, centered in 'width'/'height' canvas
            // Standard paths are 24x24 usually. 
            const iconSize = size * 0.6;
            const px = (width - iconSize) / 2;
            const py = (height - iconSize) / 2;

            const tmp = document.createElement('canvas');
            tmp.width = width;
            tmp.height = height;
            const tCtx = tmp.getContext('2d');
            if (!tCtx) return [];

            const p = new Path2D(path);
            tCtx.save();
            tCtx.translate(px, py);
            const scale = iconSize / viewBoxSize;
            tCtx.scale(scale, scale);
            tCtx.fillStyle = '#000';
            tCtx.fill(p, "evenodd");
            tCtx.restore();

            const data = tCtx.getImageData(0, 0, width, height).data;
            const pts = [];

            // Optimization: Only skip pixels if size is extremely large to prevent freezing
            let step = 1;
            // Removed step = 2 optimization to maintain consistent density at all sizes per user request

            for (let y = 0; y < height; y += step) {
                for (let x = 0; x < width; x += step) {
                    if (data[(y * width + x) * 4 + 3] > 80) pts.push({ x, y });
                }
            }
            return pts;
        };

        const ptsA = getIconPoints();

        // Particles - Matched to SocialParticleCard (Slow & Organic)
        let particles = Array.from({ length: ptsA.length }).map((_, i) => ({
            x: ptsA[i].x,
            y: ptsA[i].y,
            homeA: ptsA[i],
            speed: 0.001 + Math.random() * 0.002, // Slow, viscous movement (matches SocialParticleCard)
            friction: 0.9 + Math.random() * 0.05,
            swarmOffset: (() => {
                const angle = Math.random() * Math.PI * 2;
                const r = Math.sqrt(Math.random()) * 25; // 25px radius circular distribution
                return {
                    x: Math.cos(angle) * r,
                    y: Math.sin(angle) * r
                };
            })()
        }));

        let animId: number;
        const render = () => {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = resolvedColor;

            if (isHoveredRef.current) {
                // Swarm towards mouse with random offset to prevent "thread" line effect
                particles.forEach(p => {
                    // Target is mouse position + particle's unique random offset
                    const tx = mouseRef.current.x + p.swarmOffset.x;
                    const ty = mouseRef.current.y + p.swarmOffset.y;

                    const dx = tx - p.x;
                    const dy = ty - p.y;

                    p.x += dx * p.speed;
                    p.y += dy * p.speed;

                    // Tiny particles for dense look (matches SocialParticleCard)
                    const s = 1.0;
                    ctx.fillRect(p.x, p.y, s, s);
                });
            } else {
                // Go Home (Re-form shape)
                particles.forEach(p => {
                    const target = p.homeA;
                    const dx = target.x - p.x;
                    const dy = target.y - p.y;

                    p.x += dx * (p.speed * 3.0); // Return speed: 3x dispersion speed (visible but snappy)
                    p.y += dy * (p.speed * 3.0);

                    // Tiny particles
                    const s = 0.8;
                    ctx.fillRect(p.x, p.y, s, s);
                });
            }

            animId = requestAnimationFrame(render);
        };
        render();

        return () => {
            if (animId) cancelAnimationFrame(animId);
        };
    }, [path, size, resolvedColor, width, height]); // Added width/height to deps to handle resize

    return (
        <canvas
            ref={canvasRef}
            className={cn("", className)} // Cursor visible for better UX in playground
            onMouseEnter={() => !globalMouse && setInternalHover(true)}
            onMouseLeave={() => !globalMouse && setInternalHover(false)}
            onMouseMove={!globalMouse ? handleMouseMove : undefined}
            style={{ width: width, height: height }}
        />
    );
};
