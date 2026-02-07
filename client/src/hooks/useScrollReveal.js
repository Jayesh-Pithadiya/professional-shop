import { useEffect } from 'react';

const useScrollReveal = () => {
    useEffect(() => {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active-reveal');
                    // revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        const revealItems = document.querySelectorAll('.spectral-text, .reveal-left, .reveal-right, .reveal-bottom, .reveal-mask, .fade-in-up');
        revealItems.forEach(item => revealObserver.observe(item));

        return () => {
            revealItems.forEach(item => revealObserver.unobserve(item));
        };
    }, []);
};

export default useScrollReveal;
