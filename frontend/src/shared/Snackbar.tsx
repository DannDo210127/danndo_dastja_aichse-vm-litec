import { useEffect } from 'react';
import { useErrorStore } from '@/store/error-store';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';

export default function Snackbar(){
    const { message, type, isVisible, hideSnackbar } = useErrorStore();

    useEffect(() => {
        if (isVisible && message) {
            const timer = setTimeout(hideSnackbar, 4000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, message, hideSnackbar]);

    const getIcon = () => {
        switch(type) {
            case 'error':
                return <AlertTriangle className="flex-shrink-0 size-6 text-red-500" />;
            case 'success':
                return <CheckCircle2 className="flex-shrink-0 size-6 text-green-500" />;
            case 'info':
                return <Info className="flex-shrink-0 size-6 text-blue-500" />;
        }
    };

    const getBgColor = () => {
        switch(type) {
            case 'error':
                return ' border-3 border-red-400';
            case 'success':
                return 'border-3 border-green-400';
            case 'info':
                return 'border-3 border-blue-400';
        }
    };

    const getTextColor = () => {
        switch(type) {
            case 'error':
                return 'text-red-900';
            case 'success':
                return 'text-green-900';
            case 'info':
                return 'text-blue-900';
        }
    };

    const getDescColor = () => {
        switch(type) {
            case 'error':
                return 'text-red-700';
            case 'success':
                return 'text-green-700';
            case 'info':
                return 'text-blue-700';
        }
    };

    return (
        <div 
            onClick={hideSnackbar}  
            className={`
                fixed bottom-6 left-1/2 -translate-x-1/2 
                rounded-lg w-2/6 p-5 drop-shadow-lg
                duration-500 transition-all ease-in-out
                cursor-pointer hover:shadow-lg
                shadow-md z-[9999]
                bg-background
                ${getBgColor()}
                flex gap-4
                ${isVisible && message ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none'}
            `}
        >
            {getIcon()}
            <div className="flex-1">
                <h3 className={`font-semibold text-sm ${getTextColor()}`}>
                    {type === 'error' ? 'Error' : type === 'success' ? 'Success' : 'Info'}
                </h3>
                <p className={`text-sm ${getDescColor()} mt-1`}>
                    {message || ''}
                </p>
            </div>
        </div>
    )
} 