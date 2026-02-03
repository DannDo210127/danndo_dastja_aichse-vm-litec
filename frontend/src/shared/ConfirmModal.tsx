import { FC, useEffect } from "react";
import StandardModal from "./StandardModal";

interface ConfigModalProps {
    title: string;
    description: string;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const ConfirmModal: FC<ConfigModalProps> = ({
    title,
    description,
    isOpen,
    onClose,
    onConfirm,
}) => {
    // Handle Enter key to confirm action
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                onConfirm();
            } else if (e.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose, onConfirm]);

    return (
        <StandardModal title={title} description={description} isOpen={isOpen}>
            <div className="mt-3">
                <button
                    className="bg-red-400/50 mr-4 px-4 py-2 rounded text-font hover:scale-105 transition-all cursor-pointer"
                    onClick={onClose}
                >
                    Close
                </button>
                <button
                    className="bg-green-400/50 px-4 py-2 rounded text-font hover:scale-105 transition-all cursor-pointer"
                    onClick={onConfirm}
                >
                    Confirm
                </button>
            </div>
        </StandardModal>
    );
};
