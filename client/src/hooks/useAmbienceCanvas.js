import { useEffect } from 'react';

const useAmbienceCanvas = () => {
    useEffect(() => {
        const canvas = document.getElementById('ambience-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 40;
        let mouse = { x: 0, y: 0 };

        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        window.addEventListener('mousemove', handleMouseMove);

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2,
            });
        }

        let mouseVelocity = 0;
        let lastMousePos = { x: 0, y: 0 };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const mdvx = mouse.x - lastMousePos.x;
            const mdvy = mouse.y - lastMousePos.y;
            mouseVelocity = Math.sqrt(mdvx * mdvx + mdvy * mdvy);
            lastMousePos = { x: mouse.x, y: mouse.y };

            particles.forEach((p) => {
                const speedMult = 1 + mouseVelocity * 0.05;
                p.x += p.speedX * speedMult;
                p.y += p.speedY * speedMult;

                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    const force = (150 - dist) / 150;
                    p.x -= dx * force * 0.05 * speedMult;
                    p.y -= dy * force * 0.05 * speedMult;
                } else if (mouseVelocity < 1) {
                    p.x += dx * 0.005;
                    p.y += dy * 0.005;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(30, 41, 59, ${p.opacity})`;
                ctx.fill();
            });

            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', resize);
        };
    }, []);
};

export default useAmbienceCanvas;
