import api from "@/api/client";
import { LoadingScreen } from "@/shared/LoadingScreen";
import { StandardButton } from "@/shared/StandardButton";
import { StandardInput } from "@/shared/StandardInput";
import StandardModal from "@/shared/StandardModal";
import { useAuthStore } from "@/store/token-store";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FC, FormEvent, useEffect, useState } from "react";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    isLoading?: boolean;
}

const handleSubmit = (
    e: FormEvent | undefined,
    email: string,
    password: string,
    login: () => void,
) => {
    e?.preventDefault();
    login();
};

export const LoginModal: FC<LoginModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
}) => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const router = useRouter();
    const authStore = useAuthStore((state) => state);

    const loginUser = useMutation({
        mutationFn: async () => {
            const { data } = await api.post("/auth/login", {
                email,
                password,
            });

            authStore.setTokens(data.accessToken);
        },

        onSuccess: (data) => {
            onSubmit();
            router.refresh();
        },
    });

    // Handler for Escape key to close the modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    return (
        <StandardModal
            title="Login Required"
            description="for full access of Virtual Classroom."
            isOpen={isOpen}
            className="w-1/4"
        >
            {loginUser.isPending ? <LoadingScreen /> : null}

            <div className="flex flex-col space-y-4 mt-4">
                <form
                    onSubmit={(e) =>
                        handleSubmit(e, email, password, () =>
                            loginUser.mutate(),
                        )
                    }
                    className="flex flex-col space-y-4"
                >
                    <StandardInput
                        placeholder="Email"
                        onValueChange={(value: string) => setEmail(value)}
                    />
                    <StandardInput
                        type="password"
                        placeholder="Password"
                        onValueChange={(value: string) => setPassword(value)}
                    />

                    <div className="flex justify-between mt-2 w-full">
                        {/* PLACEHOLDER FOR OAUTH BUTTONS. PLACE OAUTH BUTTONS HERE */}

                        <div className="flex gap-4">
                            <StandardButton
                                label="Cancel"
                                onClick={onClose}
                                className="px-6 py-3"
                            />
                            <StandardButton
                                label="Login"
                                type="submit"
                                className="px-6 py-3"
                            />
                        </div>
                    </div>
                </form>
            </div>
        </StandardModal>
    );
};
