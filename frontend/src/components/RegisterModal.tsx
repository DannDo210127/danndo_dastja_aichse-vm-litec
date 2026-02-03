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
import { register } from "@/api/user";

// TypeScript interface
interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}
export const RegisterModal: FC<RegisterModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
}) => {
    // Form state
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    // Router and auth hooks
    const router = useRouter();
    const authStore = useAuthStore((state) => state);

    // Register mutation
    const registerUser = useMutation({
        mutationFn: async () => {
            const data = await register(firstName, lastName, email, password);
            authStore.setTokens(data.accessToken);
        },
        onSuccess: () => {
            onSubmit();
            router.push("/");
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

    // Handle form submission with validation
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
    
        // Validate credentials
        if (!email.trim() || !password.trim() || !firstName.trim() || !lastName.trim()) {
            return;
        }

        registerUser.mutate();
    };

    return (
        <StandardModal
            title="Register"
            description="Please make an account to use all the features."
            isOpen={isOpen}
            className="w-1/4"
        >
            {registerUser.isPending && <LoadingScreen />}

            <form onSubmit={handleSubmit} className="flex flex-col space-y-4 mt-4">
                {/* First Name Input */}
                <StandardInput
                    placeholder="First Name"
                    onValueChange={setFirstName}
                />

                {/* Last Name Input */}
                <StandardInput
                    placeholder="Last Name"
                    onValueChange={setLastName}
                />

                {/* Email Input */}
                <StandardInput
                    placeholder="Email"
                    onValueChange={setEmail}
                />

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
                        label="Register"
                        className="px-6 py-3"
                    />
                </div>
            </form>
        </StandardModal>
        );
};
