import React, { useState, useEffect } from 'react';

const Hero = () => {
    const [index, setIndex] = useState(0);
    const headings = [
        "Accurate Tailoring",
        "Bespoke Elegance",
        "Perfect Fit Guarantee",
        "Custom Stitching"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % headings.length);
        }, 2000);
        return () => clearInterval(interval);
    }, [headings.length]);

    return (
        <section id="hero" className="hero parallax-bg">
            <div className="overlay"></div>
            <div className="scroll-indicator"></div>
            <div className="hero-content fade-in-up active">
                <div className="rotating-headings">
                    {headings.map((heading, i) => (
                        <h1 key={i} className={i === index ? 'active' : ''}>
                            {heading}
                        </h1>
                    ))}
                </div>
                <p className="hero-tagline" style={{ color: '#ffffff' }}>
                    Experience the Art of Bespoke Tailoring
                </p>
                <a href="#gallery" className="btn-main">Explore Collection</a>
            </div>
        </section>
    );
};

export default Hero;
