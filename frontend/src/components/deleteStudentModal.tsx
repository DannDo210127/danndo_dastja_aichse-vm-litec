import { ConfirmModal } from "@/shared/ConfirmModal";

interface DeleteStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
}


export function DeleteStudentModal({ isOpen, onClose, onSubmit }: DeleteStudentModalProps) {


    return (
       <ConfirmModal title={"Remove student from classroom"} description={"Are you sure you want to remove this student from the classroom?"} isOpen={isOpen} onClose={onClose} onConfirm={() => onSubmit()} />
    )

}

