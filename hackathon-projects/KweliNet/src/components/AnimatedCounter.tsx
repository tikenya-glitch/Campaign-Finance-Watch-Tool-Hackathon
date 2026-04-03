import React, { useState, useEffect } from 'react';

interface AnimatedCounterProps {
    value: number;
    duration?: number;
    format?: (val: number) => string | React.ReactNode;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value, duration = 1500, format }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTimestamp: number | null = null;
        let animationFrameId: number;
        const startValue = count;
        const endValue = value;
        const difference = endValue - startValue;

        if (difference === 0) {
            setCount(endValue);
            return;
        }

        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            // easeOutExpo for a nice decelerating counter effect
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

            setCount(startValue + difference * easeProgress);

            if (progress < 1) {
                animationFrameId = window.requestAnimationFrame(step);
            } else {
                setCount(endValue);
            }
        };

        animationFrameId = window.requestAnimationFrame(step);

        return () => window.cancelAnimationFrame(animationFrameId);
    }, [value, duration]); // Intentionally omitting count from deps to avoid re-triggering mid-animation

    return <>{format ? format(count) : Math.round(count)}</>;
};

export default AnimatedCounter;
