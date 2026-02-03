// API and store imports
import api from "@/api/client";
import { useAuthStore } from "@/store/token-store";

// Shared component imports
import { LoadingScreen } from "@/shared/LoadingScreen";
import { StandardButton } from "@/shared/StandardButton";
import { StandardInput } from "@/shared/StandardInput";
import StandardModal from "@/shared/StandardModal";

// React and routing imports
import { useRouter } from "next/navigation";
import { FC, FormEvent, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/api/user";

// TypeScript interface
interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
}

export const LoginModal: FC<LoginModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
}) => {
    // Form state
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    // Router and auth hooks
    const router = useRouter();
    const authStore = useAuthStore((state) => state);

    // Login mutation
    const loginUser = useMutation({
        mutationFn: async () => {
            const data = await login(email, password);
            authStore.setTokens(data.accessToken);
        },
        onSuccess: () => {
            onSubmit();
            router.refresh();
        },
    });

    // Handle Escape key to close modal
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    // Handle form submission
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        loginUser.mutate();
    };

    return (
        <StandardModal
            title="Login Required"
            description="for full access of Virtual Classroom."
            isOpen={isOpen}
            className="w-1/4"
        >
            {loginUser.isPending && <LoadingScreen />}

            <form
                onSubmit={handleSubmit}
                className="flex flex-col space-y-4 mt-4"
            >
                {/* Email Input */}
                <StandardInput placeholder="Email" onValueChange={setEmail} />

                {/* Password Input */}
                <StandardInput
                    type="password"
                    placeholder="Password"
                    onValueChange={setPassword}
                />

                {/* Action Buttons */}
                <div className="flex gap-4 mt-2">
                    <StandardButton
                        label="Cancel"
                        onClick={onClose}
                        className="px-6 py-3"
                    />
                    <StandardButton
                        type="submit"
                        label="Login"
                        className="px-6 py-3"
                    />
                </div>
            </form>
        </StandardModal>
    );
};
