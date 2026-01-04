"use client";

import React, { useEffect, useRef } from 'react';

export const ArtodeTitle: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        // Adjusted dimensions for the title "ARTODE ICONS"
        const width = 240;
        const height = 40;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        ctx.scale(dpr, dpr);

        // 1. Create Text Mask
        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = width;
        maskCanvas.height = height;
        const maskCtx = maskCanvas.getContext('2d');
        if (!maskCtx) return;

        maskCtx.fillStyle = '#000';
        maskCtx.font = '900 24px "Helvetica Neue", "Arial", sans-serif';
        maskCtx.textBaseline = 'middle';
        maskCtx.textAlign = 'center';
        maskCtx.fillText("ARTODE ICONS", width / 2, height / 2);

        const maskData = maskCtx.getImageData(0, 0, width, height).data;

        // 2. Wave Sources
        const sources = [
            { x: width * 0.1, y: height * 0.5, wavelength: 12, phase: 0 },
            { x: width * 0.9, y: height * 0.5, wavelength: 14, phase: Math.PI },
            { x: width * 0.5, y: height * 1.5, wavelength: 20, phase: Math.PI * 0.5 }
        ];

        let time = 0;
        let animId: number;

        const render = () => {
            time += 0.002; // Slower speed
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = '#D80018'; // Swiss Red

            // Optimization: Skip empty areas if known, but iterating small canvas is fine
            // 240 * 40 = 9600 pixels, very cheap.
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const index = (y * width + x) * 4;
                    const alpha = maskData[index + 3];

                    if (alpha > 120) {
                        ctx.globalAlpha = 0.25;
                        ctx.fillRect(x, y, 1, 1);

                        let amplitude = 0;
                        for (const source of sources) {
                            const dx = x - source.x;
                            const dy = y - source.y;
                            const dist = Math.sqrt(dx * dx + dy * dy);
                            amplitude += Math.sin((dist / source.wavelength - time * 5) * 2 * Math.PI + source.phase);
                        }

                        const normalized = (amplitude + sources.length) / (sources.length * 2);
                        const value = (normalized * 12) % 1;

                        if (value > 0.6) {
                            ctx.globalAlpha = 1.0;
                            ctx.fillRect(x, y, 1, 1);
                        } else if (value > 0.25 && value < 0.35) {
                            ctx.globalAlpha = 0.5;
                            ctx.fillRect(x, y, 1, 1);
                        }
                    }
                }
            }
            animId = requestAnimationFrame(render);
        };

        render();

        return () => cancelAnimationFrame(animId);
    }, []);

    return <canvas ref={canvasRef} className="hover:opacity-80 transition-opacity" aria-label="ARTODE ICONS" />;
};
