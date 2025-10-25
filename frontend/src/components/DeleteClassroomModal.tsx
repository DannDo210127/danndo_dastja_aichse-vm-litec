import { useState } from "react";
import { FC } from "react";
import router from "next/navigation";
import { useRouter } from "next/router";
import { ConfirmModal } from "@/shared/ConfirmModal";

interface DeleteClassroomModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
}


export const DeleteClassroomModal: FC<DeleteClassroomModalProps> = ({ isOpen, onClose, onSubmit }) => {
    return (
       <ConfirmModal title={"Delete Classroom"} description={"Are you sure you want to delete this classroom? This action cannot be undone."} isOpen={isOpen} onClose={onClose} onConfirm={() => onSubmit()} />
    )
}

          