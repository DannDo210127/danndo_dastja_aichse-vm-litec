import { useEffect, useState } from 'react';

interface SnackbarProps {
    message: string;
    type: 'error' | 'success' | 'info';
}

export default function Snackbar({ message, type }: SnackbarProps){
    const [isVisible, setIsVisible] = useState(true);

    const onClose = () => {
        setIsVisible(false);
    }

    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(onClose, 10000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    // if (!isVisible) return null;

    return (
        <div 
            onClick={onClose}  
            className={`
                fixed bottom-0 left-6/10 -translate-x-1/2 
                rounded-t-[8] w-3/10 h-1/10 p-4 
                duration-300 transition-all ease-in-out
                cursor-pointer hover:scale-105
                shadow-lg
                ${type === 'error' ? 'bg-red-600' : type === 'success' ? 'bg-green-600' : 'bg-blue-600'}
                ${isVisible ? 'opacity-100' : 'opacity-0'}
                text-white
            `}
        >
            {message}
        </div>
    )
} 