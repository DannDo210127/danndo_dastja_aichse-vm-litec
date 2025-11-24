import { FC } from "react";
import StandardModal from "./StandardModal";

interface ConfigModalProps {
    title: string;
    description: string;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const ConfirmModal: FC<ConfigModalProps> = ({ title, description, isOpen, onClose, onConfirm }) => {
    return (
        <StandardModal title={title} description={description} isOpen={isOpen}>
            <div className="mt-3">
                <button className="mr-4 px-4 py-2 bg-red-300 text-font rounded hover:bg-foreground hover:scale-105 transition-all cursor-pointer" onClick={onClose}>Close</button>
                <button className="px-4 py-2 bg-blue-500 text-font rounded hover:bg-foreground hover:scale-105 transition-all cursor-pointer" onClick={onConfirm}>Confirm</button>
            </div>
        </StandardModal>
    )
}