import React, { useState, useEffect } from 'react';

const Navbar = () => {
    const [isActive, setIsActive] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Background and Padding
            setIsScrolled(currentScrollY > 50);

            // Hide/Show Logic
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const navLinks = [
        { name: 'Home', href: '#hero' },
        { name: 'About', href: '#about' },
        { name: 'Services', href: '#services' },
        { name: 'Process', href: '#measurements' },
        { name: 'Gallery', href: '#gallery' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <nav
            className={`navbar ${isScrolled ? 'scrolled' : ''}`}
            style={{
                transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
                background: isScrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.9)',
                padding: isScrolled ? '15px 5%' : '20px 5%'
            }}
        >
            <div className="logo">Pithadiya Tailor</div>
            <ul className={`nav-links ${isActive ? 'nav-active' : ''}`}>
                {navLinks.map((link) => (
                    <li key={link.name}>
                        <a href={link.href} onClick={() => setIsActive(false)}>{link.name}</a>
                    </li>
                ))}
            </ul>
            <div className={`hamburger ${isActive ? 'toggle' : ''}`} onClick={() => setIsActive(!isActive)}>
                <i className="fas fa-bars"></i>
            </div>
        </nav>
    );
};

export default Navbar;
