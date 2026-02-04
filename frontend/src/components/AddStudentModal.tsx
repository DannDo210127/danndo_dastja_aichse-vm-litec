import { addStudentToClassroom } from "@/api/classroom";
import UserApi from "@/api/user";
import { useSnackbarStore } from "@/store/snackbar-store";
import StandardModal from "@/shared/StandardModal";
import { StandardInput } from "@/shared/StandardInput";
import { StandardButton } from "@/shared/StandardButton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  classroomId?: number;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
}

export function AddStudentModal({
  isOpen,
  onClose,
  classroomId,
}: StudentModalProps) {
  const [studentInput, setStudentInput] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const { showError, showSuccess } = useSnackbarStore();
  const queryClient = useQueryClient();

  // Search students query
  const { data: filteredUser, isLoading: isFilteredUserLoading, refetch: refetchFilteredStudents} = useQuery({
    queryKey: ["students"],
    queryFn: () => UserApi.findUserByName(studentInput),
    enabled: false,
  });

  // Add student mutation
  const addStudentToClassroomMutation = useMutation({
    mutationFn: ({ classroomId, userId }: { classroomId: number; userId: number }) =>
      addStudentToClassroom(classroomId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classrooms"] });
      handleModalClose();
      showSuccess("Student added successfully");
    },
  });

  // Check if add button should be disabled
  const isAddDisabled = !selectedStudent || studentInput.trim() !== `${selectedStudent.firstName} ${selectedStudent.lastName}`;

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStudentInput("");
      setSelectedStudent(null);
      setShowDropdown(false);
    }
  }, [isOpen]);

  // Handle keyboard events
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !isAddDisabled) {
        handleAddStudent();
      } else if (e.key === "Escape") {
        handleModalClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isAddDisabled]);

  // Handle search input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStudentInput(value);

    if (value.trim().length > 0) {
      setShowDropdown(true);
      refetchFilteredStudents();
    } else {
      setShowDropdown(false);
    }
  };

  // Close dropdown on blur
  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 100);
  };

  // Handle dropdown selection
  const handleDropdownSelect = (student: User) => {
    setSelectedStudent(student);
    setStudentInput(`${student.firstName} ${student.lastName}`);
    setShowDropdown(false);
  };

  // Close modal and reset form
  const handleModalClose = () => {
    setStudentInput("");
    setSelectedStudent(null);
    setShowDropdown(false);
    onClose();
  };

  // Handle form submission
  const handleAddStudent = () => {
    if (!selectedStudent || studentInput.trim() === "") {
      showError("Please select a valid student");
      return;
    }

    if (studentInput !== `${selectedStudent.firstName} ${selectedStudent.lastName}`) {
      showError("Please select a student from the dropdown list");
      return;
    }

    addStudentToClassroomMutation.mutate({
      classroomId: classroomId!,
      userId: selectedStudent.id,
    });
  };

  return (
    <StandardModal
      className="w-96"
      title="Add Student"
      description="Search for students:"
      isOpen={isOpen}
    >
      <div className="flex flex-col space-y-4 mt-4">
        {/* Student Search Input with Dropdown */}
        <div className="relative">
          <StandardInput
            placeholder="Search Student Name"
            onChange={handleChange}
            onBlur={handleBlur}
            value={studentInput}
          />

          {/* Search Results Dropdown */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-lightforeground rounded-[8] shadow-lg drop-shadow-xl max-h-64 overflow-y-auto">
              {isFilteredUserLoading ? (
                <div className="p-3 text-center text-sm text-font">
                  Loading...
                </div>
              ) : filteredUser?.length > 0 ? (
                filteredUser.map((user: User) => (
                  <button
                    key={user.id}
                    onMouseDown={() => handleDropdownSelect(user)}
                    className="flex w-full items-center px-4 py-3 text-left text-font transition-colors hover:bg-foreground first:rounded-t-[8] last:rounded-b-[8]"
                  >
                    <span className="flex-grow">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="text-sm text-gray-500">{user.id}</span>
                  </button>
                ))
              ) : (
                <div className="p-3 text-center text-sm text-gray-400">
                  No students found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-2">
          <StandardButton
            label="Cancel"
            onClick={handleModalClose}
            className="bg-lightforeground px-6 py-3"
          />
          <StandardButton
            label="Add"
            onClick={handleAddStudent}
            disabled={isAddDisabled}
            isLoading={addStudentToClassroomMutation.isPending}
            className="bg-lightforeground hover:bg-contrast px-6 py-3 hover:text-background"
          />
        </div>
      </div>
    </StandardModal>
  );
}
