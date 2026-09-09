import React, { useState, useEffect, useRef } from 'react';

interface AnimatedCounterProps {
    value: number;
    duration?: number;
    format?: (val: number) => string | React.ReactNode;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value, duration = 1500, format }) => {
    const [count, setCount] = useState(value);
    const prevValueRef = useRef(0);

    useEffect(() => {
        const startValue = prevValueRef.current;
        const endValue = value;
        const difference = endValue - startValue;

        if (difference === 0) {
            return;
        }

        let startTimestamp: number | null = null;
        let animationFrameId: number;

        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const elapsed = timestamp - startTimestamp;
            const progress = Math.min(elapsed / duration, 1);

            // easeOutExpo for smooth deceleration
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentVal = startValue + difference * easeProgress;

            if (progress < 1) {
                setCount(currentVal);
                animationFrameId = window.requestAnimationFrame(step);
            } else {
                setCount(endValue);
                prevValueRef.current = endValue;
            }
        };

        animationFrameId = window.requestAnimationFrame(step);

        return () => {
            window.cancelAnimationFrame(animationFrameId);
            prevValueRef.current = endValue;
        };
    }, [value, duration]);

    return <>{format ? format(Math.round(count)) : Math.round(count)}</>;
};

export default AnimatedCounter;
