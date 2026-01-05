"use client";

import React, { useEffect, useRef } from 'react';

export const ArtodeTitle: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0, isActive: false });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const width = 120;
        const height = 40;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        ctx.scale(dpr, dpr);

        // 1. Create Text Mask to find valid positions
        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = width;
        maskCanvas.height = height;
        const maskCtx = maskCanvas.getContext('2d');
        if (!maskCtx) return;

        maskCtx.fillStyle = '#000';
        maskCtx.font = 'bold 24px monospace';
        maskCtx.textBaseline = 'middle';
        maskCtx.textAlign = 'center';
        maskCtx.fillText("ARTODE", width / 2, height / 2);

        const maskData = maskCtx.getImageData(0, 0, width, height).data;

        // 2. Generate Particles from Mask
        interface Particle {
            x: number;
            y: number;
            homeX: number;
            homeY: number;
            vx: number;
            vy: number;
        }

        const particles: Particle[] = [];
        // Scan with a small step to reduce density if needed, or 1 for full density
        for (let y = 0; y < height; y += 1) {
            for (let x = 0; x < width; x += 1) {
                const index = (y * width + x) * 4;
                if (maskData[index + 3] > 120) {
                    // This pixel is part of the text
                    particles.push({
                        x: x,
                        y: y,
                        homeX: x,
                        homeY: y,
                        vx: 0,
                        vy: 0
                    });
                }
            }
        }

        // 3. Wave Sources (kept for color/opacity variation if we want, or remove if physics is key)
        const sources = [
            { x: width * 0.1, y: height * 0.5, wavelength: 12, phase: 0 },
            { x: width * 0.9, y: height * 0.5, wavelength: 14, phase: Math.PI },
            { x: width * 0.5, y: height * 1.5, wavelength: 20, phase: Math.PI * 0.5 }
        ];

        let time = 0;
        let animId: number;

        const render = () => {
            time += 0.005;
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = '#D80018';

            for (const p of particles) {
                // Physics logic
                let targetX = p.homeX;
                let targetY = p.homeY;

                if (mouseRef.current.isActive) {
                    const dx = mouseRef.current.x - p.x;
                    const dy = mouseRef.current.y - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    // Attraction radius
                    if (dist < 40) {
                        const force = (40 - dist) / 40;
                        // Accumulate towards pointer, but maintain some chaotic movement aka "noise"
                        // Or just simple attraction:
                        targetX = mouseRef.current.x + (Math.random() - 0.5) * 10;
                        targetY = mouseRef.current.y + (Math.random() - 0.5) * 10;
                    }
                }

                // Simple easing towards target
                const dx = targetX - p.x;
                const dy = targetY - p.y;

                p.x += dx * 0.1;
                p.y += dy * 0.1;

                // Draw
                // Calculate wave value for opacity to keep the original "interference" aesthetic alive
                let amplitude = 0;
                for (const source of sources) {
                    const dx0 = p.x - source.x;
                    const dy0 = p.y - source.y;
                    const d = Math.sqrt(dx0 * dx0 + dy0 * dy0);
                    amplitude += Math.sin((d / source.wavelength - time * 5) * 2 * Math.PI + source.phase);
                }
                const normalized = (amplitude + sources.length) / (sources.length * 2);
                const value = (normalized * 12) % 1;

                if (value > 0.6) {
                    ctx.globalAlpha = 1.0;
                    ctx.fillRect(p.x, p.y, 1, 1);
                } else if (value > 0.25 && value < 0.35) {
                    ctx.globalAlpha = 0.5;
                    ctx.fillRect(p.x, p.y, 1, 1);
                } else {
                    // To ensure text is readable even if wave is low, maybe a base opacity?
                    // Original code:
                    // if (alpha > 120) ctx.globalAlpha = 0.25; ctx.fillRect...

                    // Let's add base visibility
                    ctx.globalAlpha = 0.15;
                    ctx.fillRect(p.x, p.y, 1, 1);
                }
            }

            animId = requestAnimationFrame(render);
        };

        render();

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current.x = (e.clientX - rect.left) * (width / rect.width);
            mouseRef.current.y = (e.clientY - rect.top) * (height / rect.height);
            mouseRef.current.isActive = true;
        };

        const handleMouseLeave = () => {
            mouseRef.current.isActive = false;
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            cancelAnimationFrame(animId);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return <canvas ref={canvasRef} className="cursor-pointer" aria-label="ARTODE ICONS" />;
};
