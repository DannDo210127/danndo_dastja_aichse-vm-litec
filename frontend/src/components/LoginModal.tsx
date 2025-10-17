import StandardModal from "@/shared/StandardModal";
import { FC } from "react";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const LoginModal: FC<LoginModalProps> = ({ isOpen, onClose, onConfirm: onSubmit }) => {
    return (
        <StandardModal
            title="Login Required"
            description="Please log in to access this feature."
            isOpen={isOpen}
        >
            <div className="flex flex-col space-y-4">
                <input
                    type="text"
                    placeholder="Username"
                    className="border p-2 rounded"
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="border p-2 rounded"
                />
                <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-all" onClick={onClose}>
                    Back
                </button>
                <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-all" onClick={onSubmit}>
                    Login
                </button>
            </div>
        </StandardModal>
    );
};
