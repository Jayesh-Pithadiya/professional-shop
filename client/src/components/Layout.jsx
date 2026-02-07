import React, { useEffect, useState } from 'react';
import useAmbienceCanvas from '../hooks/useAmbienceCanvas';
import useAdaptiveWhiteBalance from '../hooks/useAdaptiveWhiteBalance';
import useScrollReveal from '../hooks/useScrollReveal';

const Layout = ({ children }) => {
    const [scrollPercent, setScrollPercent] = useState(0);
    useAmbienceCanvas();
    useAdaptiveWhiteBalance();
    useScrollReveal();

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (currentScrollY / totalHeight) * 100;
            setScrollPercent(progress);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <div className="grain-overlay"></div>
            <div className="floating-threads-overlay"></div>
            <div className="silk-sheen-overlay"></div>
            <canvas id="ambience-canvas"></canvas>

            <div className="progress-line" style={{ width: `${scrollPercent}% ` }}>
                <div className="needle-head">🪡</div>
            </div>

            <div id="atelier-top">
                {children}
            </div>
        </>
    );
};

export default Layout;
