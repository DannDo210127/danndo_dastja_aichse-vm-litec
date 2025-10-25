import { StandardInput } from "@/shared/StandardInput";
import StandartModal from "@/shared/StandardModal";
import { StandardButton } from "@/shared/StandardButton";
import { useState } from "react";
import { FC } from "react";
import router from "next/navigation";
import { useRouter } from "next/router";

interface StudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (value: string) => void;
}


export const StudentModal: FC<StudentModalProps> = ({isOpen, onClose, onSubmit }) => {


    const [studentName, setStudentName] = useState<string>("");

    return (
        <StandartModal title={"Create Student"} description={"Enter student name:"} isOpen={isOpen}>
            <div className="flex flex-col space-y-4 mt-4">
                <StandardInput placeholder="Student Name" onValueChange={(value: string) => setStudentName(value)} />
                                    
                <div className="flex w-full justify-between mt-2">
                <div className="flex gap-4">
                    <StandardButton label="Cancel" onClick={onClose} className="px-6 py-3" />
                    <StandardButton label="Create" onClick={() => onSubmit(studentName)} className="px-6 py-3" />
                </div>

                </div>
            </div>
        </StandartModal>
    )
}

          