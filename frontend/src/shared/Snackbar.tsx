import { useEffect } from 'react';
import { useSnackbarStore } from '@/store/snackbar-store';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';

export default function Snackbar(){
    const { message, type, isVisible, hideSnackbar } = useSnackbarStore();

    useEffect(() => {
        if (isVisible && message) {
            const timer = setTimeout(hideSnackbar, 4000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, message, hideSnackbar]);

    const getIcon = () => {
        switch(type) {
            case 'error':
                return <AlertTriangle className="flex-shrink-0 size-8 text-error" />;
            case 'success':
                return <CheckCircle2 className="flex-shrink-0 size-8 text-success" />;
            case 'info':
                return <Info className="flex-shrink-0 size-8 text-info" />;
        }
    };

    const getBgColor = () => {
        switch(type) {
            case 'error':
                return ' border-2 border-error';
            case 'success':
                return 'border-2 border-success';
            case 'info':
                return 'border-2 border-info';
        }
    };

    const getTextColor = () => {
        switch(type) {
            case 'error':
                return 'text-error';
            case 'success':
                return 'text-success';
            case 'info':
                return 'text-info';
        }
    }; 

    const getDescColor = () => {
        switch(type) {
            case 'error':
                return 'text-error';
            case 'success':
                return 'text-success';
            case 'info':
                return 'text-info';
        }
    };

    return (
        <div 
            onClick={hideSnackbar}  
            className={`
                fixed bottom-6 left-1/2 -translate-x-1/2 
                rounded-lg w-2/6 p-5 drop-shadow-lg
                duration-500 transition-all ease-in-out
                cursor-pointer
                shadow-md z-[9999]
                bg-lightforeground

                ${getBgColor()}
                flex gap-4
                ${isVisible && message ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none'}
            `}
        >
            {getIcon()}
            <div className="flex-1">
                <h3 className={`font-bold text-xl ${getTextColor()}`}>
                    {type === 'error' ? 'Error' : type === 'success' ? 'Success' : 'Info'}
                </h3>
                <p className={`font-light text-md ${getDescColor()} mt-1`}>
                    {message || ''}
                </p>
            </div>
        </div>
    )
} 