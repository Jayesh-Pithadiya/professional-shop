import React, { useEffect, useRef } from 'react';

const CustomCursor = () => {
    const cursorRef = useRef(null);
    const canvasRef = useRef(null);
    const mouse = useRef({ x: 0, y: 0 });
    const points = useRef([]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;

            if (cursorRef.current) {
                cursorRef.current.style.left = `${e.clientX}px`;
                cursorRef.current.style.top = `${e.clientY}px`;
            }
        };

        const handleMouseEnter = () => cursorRef.current?.classList.add('hovered');
        const handleMouseLeave = () => cursorRef.current?.classList.remove('hovered');

        window.addEventListener('mousemove', handleMouseMove);

        const interactives = document.querySelectorAll('a, button, .gallery-item, .filter-btn, .service-card');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', handleMouseEnter);
            el.addEventListener('mouseleave', handleMouseLeave);
        });

        // Thread logic
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const pointCount = 15;
        const tension = 0.4;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            points.current = Array(pointCount).fill({ x: mouse.current.x, y: mouse.current.y });
        };

        window.addEventListener('resize', resize);
        resize();

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            let px = mouse.current.x;
            let py = mouse.current.y;

            points.current = points.current.map(p => {
                const x = p.x + (px - p.x) * tension;
                const y = p.y + (py - p.y) * tension;
                px = x;
                py = y;
                return { x, y };
            });

            ctx.beginPath();
            ctx.moveTo(mouse.current.x, mouse.current.y);

            for (let i = 0; i < points.current.length - 1; i++) {
                const p1 = points.current[i];
                const p2 = points.current[i + 1];
                const xc = (p1.x + p2.x) / 2;
                const yc = (p1.y + p2.y) / 2;
                ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);
            }

            ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
            ctx.lineWidth = 1.5;
            ctx.lineCap = 'round';
            ctx.stroke();

            requestAnimationFrame(animate);
        };

        const rafId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', resize);
            interactives.forEach(el => {
                el.removeEventListener('mouseenter', handleMouseEnter);
                el.removeEventListener('mouseleave', handleMouseLeave);
            });
            cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <>
            <canvas ref={canvasRef} id="thread-canvas" />
            <div ref={cursorRef} id="cursor-needle">🪡</div>
        </>
    );
};

export default CustomCursor;
