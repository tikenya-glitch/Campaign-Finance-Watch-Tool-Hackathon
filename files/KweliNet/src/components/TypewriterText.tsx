import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
    fullText: string;
    baseText?: string;
    eraseAmount?: number;
    typingSpeed?: number;
    eraseSpeed?: number;
    delay?: number;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
    fullText,
    baseText = '',
    eraseAmount = 3,
    typingSpeed = 150,
    eraseSpeed = 100,
    delay = 5000
}) => {
    // Sequence states: 
    // Wait -> Type base -> Type rest -> Wait -> Erase 'amount' -> Type 'amount' -> Loop
    const [displayedText, setDisplayedText] = useState(fullText);
    const [phase, setPhase] = useState<'idle' | 'erasing' | 'typing'>('idle');

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;

        if (phase === 'idle') {
            timeout = setTimeout(() => {
                setPhase('erasing');
            }, delay);
        } else if (phase === 'erasing') {
            if (displayedText.length > fullText.length - eraseAmount) {
                timeout = setTimeout(() => {
                    setDisplayedText(prev => prev.slice(0, -1));
                }, eraseSpeed);
            } else {
                setPhase('typing');
            }
        } else if (phase === 'typing') {
            if (displayedText.length < fullText.length) {
                timeout = setTimeout(() => {
                    setDisplayedText(fullText.slice(0, displayedText.length + 1));
                }, typingSpeed);
            } else {
                setPhase('idle');
            }
        }

        return () => clearTimeout(timeout);
    }, [displayedText, phase, fullText, eraseAmount, typingSpeed, eraseSpeed, delay]);

    return (
        <span className="inline-flex items-center">
            {displayedText}
            <span className="inline-block w-[3px] h-[1em] ml-1 opacity-70 bg-current animate-pulse" />
        </span>
    );
};

export default TypewriterText;
