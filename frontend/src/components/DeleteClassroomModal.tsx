import { ConfirmModal } from "@/shared/ConfirmModal";

interface DeleteClassroomModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
}

export function DeleteClassroomModal({
    isOpen,
    onClose,
    onSubmit,
}: DeleteClassroomModalProps) {
    return (
        <ConfirmModal
            title={"Delete Classroom"}
            description={
                "Are you sure you want to delete this classroom? This action cannot be undone."
            }
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={() => onSubmit()}
        />
    );
}
