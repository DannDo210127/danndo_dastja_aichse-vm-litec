import { StandardButton } from "@/shared/StandardButton";
import { StandardInput } from "@/shared/StandardInput";
import StandardModal from "@/shared/StandardModal";
import { useEffect, useState } from "react";

interface CreateClassroomModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string, description: string) => void;
    errormessage: string;
}

export function CreateClassroomModal({
    isOpen,
    onClose,
    onSubmit,
    errormessage,
}: CreateClassroomModalProps) {
    const [classroomName, setClassroomName] = useState<string>("");
    const [classroomDescription, setClassroomDescription] =
        useState<string>("");
    const [showError, setShowError] = useState<boolean>(false);

    const isCreateDisabled = classroomName.trim() === "";

    // Reset error visibility when modal closes
    useEffect(() => {
        if (!isOpen) {
            setShowError(false);
            setClassroomName("");
        }
    }, [isOpen]);

    // Show error when errormessage changes and is not empty
    useEffect(() => {
        if (errormessage) {
            setShowError(true);
        }
    }, [errormessage]);

    const handleSubmit = () => {
        if (isCreateDisabled) return;
        onSubmit(classroomName, classroomDescription);
    };

    useEffect(() => {
        if (isOpen) {
            document.getElementsByName("StandardInput")[0]?.focus();
        }
    }, [isOpen]);

    // Handler for Enter key to submit the form
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                handleSubmit();
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
    }, [isOpen, classroomName, onClose]); // Add dependencies

    return (
        <StandardModal
            className="w-96"
            title={"Create Classroom"}
            description={""}
            isOpen={isOpen}
        >
            <div className="flex flex-col space-y-4 mt-4">
                <StandardInput
                    placeholder="Classname"
                    onValueChange={(value: string) => setClassroomName(value)}
                />
                <StandardInput
                    placeholder="add description"
                    onValueChange={(value: string) =>
                        setClassroomDescription(value)
                    }
                />
                <div
                    className={`
                        overflow-hidden transition-all duration-300 ease-in-out
                        ${showError && errormessage ? "max-h-20 opacity-100 py-2 px-4" : "max-h-0 opacity-0"}
                        bg-red-400 rounded-[8] text-font text-sm 
                    `}
                >
                    {errormessage}
                </div>

                <div className="flex justify-between mt-2 w-full">
                    <div className="flex gap-4 w-full">
                        <StandardButton
                            label="Cancel"
                            onClick={onClose}
                            className="bg-lightforeground px-6 py-3"
                        />
                        <StandardButton
                            
                            label="Create"
                            onClick={handleSubmit}
                            className={
                                "ml-1 h-full px-10 py-3 bg-lightforeground " +
                                (isCreateDisabled
                                    ? ""
                                    : "bg-contrast! text-background")
                            }
                            disabled={isCreateDisabled}
                        />
                    </div>
                </div>
            </div>
        </StandardModal>
    );
}
