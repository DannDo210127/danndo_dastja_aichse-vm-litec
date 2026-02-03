// API and shared component imports
import { StandardButton } from '@/shared/StandardButton';
import { StandardInput } from '@/shared/StandardInput';
import StandardModal from '@/shared/StandardModal';
import { useEffect, useState } from 'react';

// Props interface for the modal
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
  // Form state
  const [classroomName, setClassroomName] = useState<string>('');
  const [classroomDescription, setClassroomDescription] = useState<string>('');

  const isCreateDisabled = classroomName.trim() === '';

  useEffect(() => {
    if (!isOpen) {
      setClassroomName('');
      setClassroomDescription('');
    }
  }, [isOpen]);

  // Focus input and handle keyboard events
  useEffect(() => {
    if (!isOpen) return;

    // Focus classroom name input when modal opens
    const input = document.getElementsByName('StandardInput')[0];
    input?.focus();

    // Handle Enter and Escape keys
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !isCreateDisabled) {
        handleCreateClassroom();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isCreateDisabled, onClose]);

  // Handle form submission
  const handleCreateClassroom = () => {
    if (!isCreateDisabled) {
      onSubmit(classroomName, classroomDescription);
    }
  };

  return (
    <StandardModal
      className="w-96"
      title="Create Classroom"
      description=""
      isOpen={isOpen}
    >
      <div className="flex flex-col space-y-4 mt-4">
        {/* Classroom Name Input */}
        <StandardInput
          placeholder="Classname"
          onValueChange={setClassroomName}
        />

        {/* Classroom Description Input */}
        <StandardInput
          placeholder="Add description"
          onValueChange={setClassroomDescription}
        />

        {/* Action Buttons */}
        <div className="flex gap-4 mt-2 w-full">
          <StandardButton
            label="Cancel"
            onClick={onClose}
            className="bg-lightforeground px-6 py-3"
          />
          <StandardButton
            label="Create"
            onClick={handleCreateClassroom}
            disabled={isCreateDisabled}
            className={`ml-1 h-full px-10 py-3 ${
              isCreateDisabled
                ? 'bg-lightforeground'
                : 'bg-contrast! text-background'
            }`}
          />
        </div>
      </div>
    </StandardModal>
  );
}
