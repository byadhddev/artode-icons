"use client";

import React, { useEffect, useRef } from 'react';

import { InteractiveArtodeIcon } from './interactive-artode-icon';

export interface ArtodeIconProps {
    /** SVG Path string for the icon shape */
    path: string;
    /** Size of the canvas/icon in pixels */
    size?: number;
    /** Override the primary Swiss Red color */
    color?: string;
    /** ClassName for additional styling */
    className?: string;
    /** Force hover state for animation control */
    forceHover?: boolean;
    /** Draw either the stroke or the fill of the SVG path */
    drawType?: 'fill' | 'stroke';
    /** Enable interactive particle mode */
    interactive?: boolean;
    /** Enable global mouse tracking for interactive mode */
    globalMouse?: boolean;
    /** Custom canvas size for interactive mode (width, height) */
    customCanvasSize?: { width: number; height: number };
    /** Custom viewBox size of the SVG path. Defaults to 24. */
    viewBoxSize?: number;
}

export const ArtodeIcon: React.FC<ArtodeIconProps> = ({
    path: pathString,
    size = 32,
    color = '#D80018',
    className,
    forceHover = false,
    drawType = 'fill',
    interactive = false,
    globalMouse = false,
    customCanvasSize,
    viewBoxSize = 24
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [internalHover, setInternalHover] = React.useState(false);
    const isHovered = forceHover || internalHover;

    if (interactive) {
        return (
            <InteractiveArtodeIcon
                path={pathString}
                size={size}
                color={color}
                className={className}
                forceHover={forceHover}
                globalMouse={globalMouse}
                customCanvasSize={customCanvasSize}
                viewBoxSize={viewBoxSize}
            />
        );
    }


    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // High DPI support
        const dpr = window.devicePixelRatio || 1;

        if (canvas.width !== size * dpr) {
            canvas.width = size * dpr;
            canvas.height = size * dpr;
            canvas.style.width = `${size}px`;
            canvas.style.height = `${size}px`;
            ctx.scale(dpr, dpr);
        }

        // 1. Create Mask using Path2D
        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = size;
        maskCanvas.height = size;
        const maskCtx = maskCanvas.getContext('2d');
        if (!maskCtx) return;

        const path = new Path2D(pathString);

        maskCtx.fillStyle = '#000';
        maskCtx.strokeStyle = '#000';
        maskCtx.lineWidth = 2; // Default stroke width

        // Assumption: Input paths are normalized to a standard viewport (e.g., 24x24 like Lucide/Material)
        // Adjust scale to fill the requested size
        const scale = size / viewBoxSize;
        maskCtx.scale(scale, scale);

        if (drawType === 'stroke') {
            maskCtx.stroke(path);
        } else {
            // Use evenodd rule to handle complex paths with holes (like X or WhatsApp)
            maskCtx.fill(path, "evenodd");
        }

        const maskData = maskCtx.getImageData(0, 0, size, size).data;

        // 2. Wave Sources for Interference Pattern (matching ArtodesGitHub.tsx style)
        const sources = [
            { x: size * 0.2, y: size * 0.2, wavelength: size * 0.125, phase: 0 },
            { x: size * 0.8, y: size * 0.8, wavelength: size * 0.1875, phase: Math.PI },
            { x: size * 0.5, y: size * 1.5, wavelength: size * 0.25, phase: Math.PI * 0.5 }
        ];

        let time = 0;
        let animId: number;

        const render = () => {
            if (isHovered) {
                time += 0.005; // Slightly faster animation on hover
            } else {
                // Static time for idle state to show some texture but no movement
                time = 1.0;
            }

            ctx.clearRect(0, 0, size, size);
            ctx.fillStyle = color;

            // Optimization: Iterate pixels
            // For small icons (e.g. 32x32), iterating all pixels is cheap ~1024 iterations
            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size; x++) {
                    const index = (y * size + x) * 4;
                    const alpha = maskData[index + 3];

                    if (alpha > 100) {
                        // Base visibility (dimmed background of the shape)
                        // If not hovered, make it more solid/readable
                        ctx.globalAlpha = isHovered ? 0.5 : 0.7;
                        ctx.fillRect(x, y, 1, 1);

                        // Only calculate waves if hovered to save CPU
                        if (isHovered) {
                            // Wave Calculation
                            let amplitude = 0;
                            for (const source of sources) {
                                const dx = x - source.x;
                                const dy = y - source.y;
                                const dist = Math.sqrt(dx * dx + dy * dy);
                                amplitude += Math.sin((dist / source.wavelength - time * 10) * 2 * Math.PI + source.phase);
                            }

                            // Normalize amplitude to 0-1 range roughly
                            const normalized = (amplitude + sources.length) / (sources.length * 2);
                            const val = (normalized * 5) % 1;

                            // Threshold for the "bright" wave lines
                            if (val > 0.65) {
                                ctx.globalAlpha = 1.0;
                                ctx.fillRect(x, y, 1, 1);
                            }
                        }
                    }
                }
            }

            if (isHovered) {
                animId = requestAnimationFrame(render);
            }
        };

        // Initial render
        render();

        return () => {
            if (animId) cancelAnimationFrame(animId);
        };
    }, [pathString, size, color, isHovered, drawType, viewBoxSize]);

    return (
        <canvas
            ref={canvasRef}
            className={`transition-opacity ${className || ''}`}
            aria-hidden="true"
            onMouseEnter={() => setInternalHover(true)}
            onMouseLeave={() => setInternalHover(false)}
        />
    );
};
