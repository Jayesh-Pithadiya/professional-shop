import React, { useEffect } from 'react';

const Preloader = ({ onComplete }) => {
    useEffect(() => {
        // Ported from script.js logic
        const timer = setTimeout(() => {
            onComplete();
        }, 6500); // 6.5s total as defined in the original script

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div id="preloader">
            <div className="preloader-background"></div>
            <div className="loader-container">
                <svg className="needle-thread-svg" viewBox="0 0 400 200">
                    <path
                        id="stitch-path"
                        d="M 50 100 Q 100 50 150 100 T 250 100 T 350 100"
                        fill="none"
                        stroke="var(--gold-primary)"
                        strokeWidth="2"
                        strokeDasharray="1000"
                        strokeDashoffset="1000"
                    />
                    <g id="needle">
                        <path d="M -20 0 L 20 0 M 15 -5 L 25 0 L 15 5 Z" fill="var(--gold-primary)" />
                        <circle cx="-15" cy="0" r="2" fill="white" />
                    </g>
                </svg>
                <div className="loader-brand">
                    {['P', 'I', 'T', 'H', 'A', 'D', 'I', 'Y', 'A'].map((letter, index) => (
                        <span key={index} className="letter" style={{ animationDelay: `${0.3 + index * 0.2}s` }}>
                            {letter}
                        </span>
                    ))}
                </div>
                <p className="loader-subtext">Crafting Excellence Since 2008</p>
            </div>
        </div>
    );
};

export default Preloader;
