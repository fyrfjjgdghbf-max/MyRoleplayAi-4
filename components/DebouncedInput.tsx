import React, { useState, useEffect, useRef } from 'react';

interface DebouncedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    value: string;
    onDebounceChange: (value: string) => void;
    delay?: number;
}

export const DebouncedInput: React.FC<DebouncedInputProps> = ({ value, onDebounceChange, delay = 500, ...props }) => {
    const [localValue, setLocalValue] = useState(value);
    const onDebounceChangeRef = useRef(onDebounceChange);
    const isTypingRef = useRef(false);

    useEffect(() => {
        onDebounceChangeRef.current = onDebounceChange;
    }, [onDebounceChange]);

    useEffect(() => {
        if (!isTypingRef.current) {
            setLocalValue(value);
        }
    }, [value]);

    useEffect(() => {
        if (!isTypingRef.current) return;

        const handler = setTimeout(() => {
            isTypingRef.current = false;
            if (localValue !== value) {
                onDebounceChangeRef.current(localValue);
            }
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [localValue, delay, value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        isTypingRef.current = true;
        setLocalValue(e.target.value);
        if (props.onChange) {
            props.onChange(e);
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (isTypingRef.current) {
            isTypingRef.current = false;
            if (localValue !== value) {
                onDebounceChangeRef.current(localValue);
            }
        }
        if (props.onBlur) {
            props.onBlur(e);
        }
    };

    return (
        <input
            {...props}
            value={localValue}
            onChange={handleChange}
            onBlur={handleBlur}
        />
    );
};
