import { useEffect } from 'react';

const useAdaptiveWhiteBalance = () => {
    useEffect(() => {
        const updateWhiteBalance = () => {
            const hour = new Date().getHours();
            let tint = "rgba(15, 23, 42, 0)";

            if (hour >= 6 && hour < 10) { // Dawn
                tint = "rgba(37, 99, 235, 0.02)";
            } else if (hour >= 16 && hour < 20) { // Sunset
                tint = "rgba(251, 146, 60, 0.03)";
            } else if (hour >= 20 || hour < 6) { // Night
                tint = "rgba(15, 23, 42, 0.05)";
            }

            document.documentElement.style.setProperty('--wb-tint', tint);
            document.body.style.backgroundImage = `linear-gradient(${tint}, ${tint})`;
        };

        updateWhiteBalance();
        const interval = setInterval(updateWhiteBalance, 60000);
        return () => clearInterval(interval);
    }, []);
};

export default useAdaptiveWhiteBalance;
