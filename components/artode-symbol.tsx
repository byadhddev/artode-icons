"use client";

import React, { useEffect, useRef } from 'react';

export const ArtodeSymbol: React.FC<{ className?: string, yOffset?: number, anchorId?: string }> = ({ className, yOffset = 0, anchorId }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0, isActive: false });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: any[] = [];

        // Wave Sources configuration
        const sources = [
            { x: 0, y: 0, wavelength: 12, phase: 0 },
            { x: 0, y: 0, wavelength: 14, phase: Math.PI },
            { x: 0, y: 0, wavelength: 20, phase: Math.PI * 0.5 }
        ];

        const init = () => {
            const rect = container.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            const width = rect.width;
            const height = rect.height;

            // Set internal resolution based on DPR
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            // Style size is handled by className (w-full h-full) so no imperative style needed if container is sized

            ctx.scale(dpr, dpr);

            // Re-calculate center
            let cx = width / 2;
            let cy = (height / 2) + yOffset;

            // If anchor element is provided, align to it
            if (anchorId) {
                const anchor = document.getElementById(anchorId);
                if (anchor) {
                    const anchorRect = anchor.getBoundingClientRect();
                    // Calculate position relative to the container
                    const relativeLeft = anchorRect.left - rect.left;
                    const relativeTop = anchorRect.top - rect.top;

                    cx = relativeLeft + (anchorRect.width / 2);
                    cy = relativeTop + (anchorRect.height / 2);
                }
            }

            // Update source positions relative to new center
            sources[0].x = cx * 0.2; sources[0].y = cy;
            sources[1].x = cx * 1.8; sources[1].y = cy;
            sources[2].x = cx; sources[2].y = cy * 2;

            // 1. Create Icon Mask (Isometric Cube)
            const maskCanvas = document.createElement('canvas');
            maskCanvas.width = width;
            maskCanvas.height = height;
            const maskCtx = maskCanvas.getContext('2d');
            if (!maskCtx) return;

            const size = 32;
            const angle = Math.PI / 6;

            const getHexPoint = (i: number) => ({
                x: cx + size * Math.cos(angle + i * Math.PI / 3),
                y: cy + size * Math.sin(angle + i * Math.PI / 3)
            });

            const p0 = getHexPoint(0);
            const p1 = getHexPoint(1);
            const p2 = getHexPoint(2);
            const p3 = getHexPoint(3);
            const p4 = getHexPoint(4);
            const p5 = getHexPoint(5);

            maskCtx.fillStyle = '#000';
            const gap = 2;

            // Top
            maskCtx.beginPath();
            maskCtx.moveTo(cx, cy - gap);
            maskCtx.lineTo(p3.x + gap, p3.y);
            maskCtx.lineTo(p4.x, p4.y + gap);
            maskCtx.lineTo(p5.x - gap, p5.y);
            maskCtx.closePath();
            maskCtx.fill();

            // Right
            maskCtx.beginPath();
            maskCtx.moveTo(cx + gap, cy + gap / 2);
            maskCtx.lineTo(p5.x, p5.y + gap * 2);
            maskCtx.lineTo(p0.x, p0.y);
            maskCtx.lineTo(p1.x, p1.y - gap);
            maskCtx.closePath();
            maskCtx.fill();

            // Left
            maskCtx.beginPath();
            maskCtx.moveTo(cx - gap, cy + gap / 2);
            maskCtx.lineTo(p1.x, p1.y - gap);
            maskCtx.lineTo(p2.x, p2.y);
            maskCtx.lineTo(p3.x, p3.y + gap * 2);
            maskCtx.closePath();
            maskCtx.fill();

            const maskData = maskCtx.getImageData(0, 0, width, height).data;

            // 2. Generate Particles
            particles = [];
            for (let y = 0; y < height; y += 1) {
                for (let x = 0; x < width; x += 1) {
                    const index = (y * width + x) * 4;
                    if (maskData[index + 3] > 120) {
                        particles.push({
                            x: x,
                            y: y,
                            homeX: x,
                            homeY: y,
                            vx: 0,
                            vy: 0,
                            speed: 0.001 + Math.random() * 0.004 // Individual random speed
                        });
                    }
                }
            }
            // 3. Generate Text Targets (adhd dev)
            const textCanvas = document.createElement('canvas');
            textCanvas.width = width;
            textCanvas.height = height;
            const textCtx = textCanvas.getContext('2d');

            if (textCtx) {
                textCtx.textBaseline = 'middle';
                textCtx.fillStyle = '#fff';

                // Measure texts for perfect centering
                textCtx.font = 'bold 20px ui-monospace, SFMono-Regular, Menlo, monospace';
                const mainWidth = textCtx.measureText('adhd dev').width;

                textCtx.font = '500 10px ui-monospace, SFMono-Regular, Menlo, monospace';
                const byWidth = textCtx.measureText('by').width;

                const gap = 8;
                const totalWidth = byWidth + gap + mainWidth;
                const startX = cx - totalWidth / 2;

                // Draw "by"
                textCtx.textAlign = 'left';
                textCtx.font = '500 10px ui-monospace, SFMono-Regular, Menlo, monospace';
                textCtx.fillText('by', startX, cy + 2); // Alignment tweak

                // Draw "adhd.dev"
                textCtx.font = 'bold 20px ui-monospace, SFMono-Regular, Menlo, monospace';
                textCtx.fillText('adhd.dev', startX + byWidth + gap, cy);

                const textData = textCtx.getImageData(0, 0, width, height).data;
                const textPoints: { x: number, y: number }[] = [];

                // Scan for text points
                for (let y = 0; y < height; y += 1) {
                    for (let x = 0; x < width; x += 1) {
                        const index = (y * width + x) * 4;
                        if (textData[index + 3] > 120) {
                            textPoints.push({ x, y });
                        }
                    }
                }

                // Shuffle text points to make the morph look less "scanned"
                textPoints.sort(() => Math.random() - 0.5);

                // Assign text targets to particles
                if (textPoints.length > 0) {
                    particles.forEach((p, i) => {
                        // Cycle through text points so all particles have a destination
                        // This creates a dense text effect as multiple particles stack
                        const target = textPoints[i % textPoints.length];
                        p.textX = target.x;
                        p.textY = target.y;
                    });
                } else {
                    // Fallback to center if no text (safety)
                    particles.forEach(p => {
                        p.textX = cx;
                        p.textY = cy;
                    });
                }
            }
        };

        // Initial setup
        init();

        // Mouse Handlers
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();

            // Check if mouse is within bounds
            const isInside =
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom;

            if (isInside) {
                // Map to canvas text space
                mouseRef.current.x = e.clientX - rect.left;
                mouseRef.current.y = e.clientY - rect.top;
                mouseRef.current.isActive = true;
            } else {
                mouseRef.current.isActive = false;
            }
        };

        const handleMouseLeaveWindow = () => {
            mouseRef.current.isActive = false;
        };

        window.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeaveWindow);

        // Render Loop
        let time = 0;
        const render = () => {
            time += 0.005;
            const width = canvas.width / (window.devicePixelRatio || 1);
            const height = canvas.height / (window.devicePixelRatio || 1);

            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = '#D80018';

            // Determine easing based on state
            // If active (interacting), use very slow fluid 0.003 (match social icons feel)
            // If inactive (returning), use snappy 0.2 as previously requested
            const easedFriction = mouseRef.current.isActive ? 0.003 : 0.2;

            for (const p of particles) {
                let targetX = p.homeX;
                let targetY = p.homeY;

                // Use individual speed is hovered, else snap back
                const friction = mouseRef.current.isActive ? p.speed : 0.2;

                // Disordered/Uncertain Motion Logic
                // Morph Logic
                if (mouseRef.current.isActive) {
                    targetX = p.textX;
                    targetY = p.textY;

                    // Tiny subtle organic wobble to keep it alive (breathing effect)
                    const wobble = Math.sin(time * 3 + p.x * 0.05) * 1.5;
                    targetY += wobble;
                }

                const dx = targetX - p.x;
                const dy = targetY - p.y;

                // Variable easing
                p.x += dx * friction;
                p.y += dy * friction;

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
                    ctx.globalAlpha = 0.15;
                    ctx.fillRect(p.x, p.y, 1, 1);
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        const handleResize = () => {
            init();
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeaveWindow);
            window.removeEventListener('resize', handleResize);
        };
    }, [yOffset, anchorId]);

    return (
        <div ref={containerRef} className={`w-full h-full ${className}`}>
            <canvas ref={canvasRef} className="block w-full h-full" aria-label="Artode Symbol" />
        </div>
    );
};
