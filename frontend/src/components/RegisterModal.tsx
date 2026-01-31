import api from "@/api/client";
import { LoadingScreen } from "@/shared/LoadingScreen";
import { StandardButton } from "@/shared/StandardButton";
import { StandardInput } from "@/shared/StandardInput";
import StandardModal from "@/shared/StandardModal";
import { useAuthStore } from "@/store/token-store";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FC, FormEvent, useEffect, useState } from "react";

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
}
// TODO: Implement better error handling
const checkCredentials = (
    email: string,
    firstName: string,
    lastName: string,
    password: string,
) => {
    if (!email && !password) return false;

    return true;
};

const handleSubmit = (
    e: FormEvent | undefined,
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    register: () => void,
    onSubmitCb: () => void,
) => {
    e?.preventDefault();

    if (!checkCredentials(email, firstName, lastName, password)) return false;

    register();
    onSubmitCb();
};
export const RegisterModal: FC<RegisterModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
}) => {
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const router = useRouter();
    const authStore = useAuthStore((state) => state);

    const registerUser = useMutation({
        mutationFn: async () => {
            const { data } = await api.post("/auth/register", {
                firstName,
                lastName,
                email,
                password,
            });

            authStore.setTokens(data.accessToken);
        },

        onSuccess: (data) => {
            router.push("/");
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
            title="Register"
            description="Please make an account to use all the features."
            isOpen={isOpen}
            className="w-1/4"
        >
            {registerUser.isPending ? <LoadingScreen /> : null}

            <div className="flex flex-col space-y-4 mt-4">
                <form
                    onSubmit={(e) =>
                        handleSubmit(
                            e,
                            email,
                            firstName,
                            lastName,
                            password,
                            () => registerUser.mutate(),
                            onSubmit,
                        )
                    }
                    className="flex flex-col space-y-4"
                >
                    <StandardInput
                        placeholder="First Name"
                        onValueChange={(value: string) => setFirstName(value)}
                    />
                    <StandardInput
                        placeholder="Last Name"
                        onValueChange={(value: string) => setLastName(value)}
                    />
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
