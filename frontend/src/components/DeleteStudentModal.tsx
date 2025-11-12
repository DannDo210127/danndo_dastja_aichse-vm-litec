import { useState } from "react";
import { FC } from "react";
import router from "next/navigation";
import { useRouter } from "next/router";
import { ConfirmModal } from "@/shared/ConfirmModal";

interface DeleteStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
}


export const DeleteStudentModal: FC<DeleteStudentModalProps> = ({ isOpen, onClose, onSubmit }) => {
    return (
       <ConfirmModal title={"Delete Student"} description={"Are you sure you want to delete this student? This action cannot be undone."} isOpen={isOpen} onClose={onClose} onConfirm={() => onSubmit()} />
    )
}

          