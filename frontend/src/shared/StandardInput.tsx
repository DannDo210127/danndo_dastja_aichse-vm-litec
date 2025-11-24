import { FC } from "react";

interface StandardInputProps {
    type?: string;
    placeholder?: string;
    onValueChange?: (value: string) => void;
    className?: string;
}

export const StandardInput: FC<StandardInputProps> = ({ placeholder, onValueChange, type, className }) => {
    return (
        <input type={type ? type : "text"} placeholder={placeholder} onChange={(e) => onValueChange?.(e.target.value)} className={"border border-lightforeground rounded-lg p-2 " + className} />
    );
}