import { addStudentToClassroom } from "@/api/classroom";
import { useErrorStore } from "@/store/error-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import UserApi from "@/api/user";
import StandardModal from "@/shared/StandardModal";
import { StandardInput } from "@/shared/StandardInput";
import { StandardButton } from "@/shared/StandardButton";

interface StudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    errormessage: string;
    classroomId?: number;
}

export function AddStudentModal({isOpen, onClose, errormessage, classroomId}: StudentModalProps) {

    

    const [studentInput, setStudentInput] = useState<[string,number]>(["", 0]);
    const [selectedStudent, setSelectedStudent] = useState<[string,number]>(["", 0]);

    const [showDropdown, setShowDropdown] = useState<boolean>(false);

    const [isCreateDisabled, setIsCreateDisabled] = useState<boolean>(studentInput[0].trim() === selectedStudent[0].trim());

    const { showError, showSuccess } = useErrorStore();

    const queryClient = useQueryClient();
    const searchStudentsQuery = useQuery({
        queryKey: ['students'],
        queryFn: () => UserApi.findUserByName(studentInput[0]),
        enabled: false,
    });
    const addStudentToClassroomMutation = useMutation({
        mutationFn: ({ classroomId, userId }: { classroomId: number; userId: number }) => {
            return addStudentToClassroom(classroomId, userId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['classrooms'] });
            handleModalClose();
            showSuccess("Student added to classroom successfully");
        },
        onError: () => {
            showError("Failed to add student to classroom");
        }
    });

    useEffect(() => {
        if (!isOpen) {
            setStudentInput(["", 0]);
            setShowDropdown(false);
        }
    }, [isOpen]);

    const handleModalClose = () => {
        setStudentInput(["", 0]);
        setShowDropdown(false);
        onClose();
    };

    const handleSubmit = () => {
        // Check if input is empty
        if (studentInput[0].trim() === "") {
            showError("Student name cannot be empty");
            return;
        }
        
        // Check if input matches selected student
        if (studentInput[0].trim() !== selectedStudent[0].trim()) {
            showError("Please select a student from the dropdown list");
            return;
        }
        
        // Check if a student was actually selected (has valid ID)
        if (selectedStudent[1] === 0) {
            showError("Please select a valid student from the dropdown list");
            return;
        }
        
        addStudentToClassroomMutation.mutate({ classroomId: classroomId!, userId: selectedStudent[1] });
    };

    const handleDropdownSelect = (student: User) => {
        setSelectedStudent([`${student.firstName} ${student.lastName}`, student.id]);
        setStudentInput([`${student.firstName} ${student.lastName}`, student.id]);
        setIsCreateDisabled(false);
        setShowDropdown(false);
    };

    // Handler for Enter key to submit the form
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                handleSubmit();
            } else if(e.key === "Escape"){
                handleModalClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, studentInput[0], onClose]); 


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setStudentInput([value, 0]);
        
        const isDisabled = value.trim() === "" || value.trim() !== selectedStudent[0].trim();
        setIsCreateDisabled(isDisabled);
        
        if (value.trim().length > 0) {
            setShowDropdown(true);
            searchStudentsQuery.refetch();
        } else {
            setShowDropdown(false);
        }
    };

    const handleBlur = () => {
        setTimeout(() => {
            setShowDropdown(false);
        }, 100);
    };

    useEffect(() => {
        if (searchStudentsQuery.data) {
            searchStudentsQuery.refetch();
        }
    }, [searchStudentsQuery.data]);



    return (
        <StandardModal className="w-96" title={"Add Student"} description={"Search for students:"} isOpen={isOpen}>
            <div className="flex flex-col space-y-4 mt-4">
                <div className="relative">
                    <StandardInput 
                        placeholder="Search Student Name" 
                        onChange={(e) => handleChange(e)}
                        onBlur={handleBlur}
                        value={studentInput[0]}
                    />

                    
                    {/* Dropdown for search results */}
                    {showDropdown && (
                        <div className="top-full right-0 left-0 z-50 absolute bg-lightforeground shadow-lg drop-shadow-xl mt-1 border-foreground rounded-[8] w-full max-w-full max-h-64">
                            {searchStudentsQuery.isFetching ? (
                                <div className="p-3 text-font text-sm text-center">Loading...</div>
                            ) : (searchStudentsQuery.data.length > 0 ? 
                               (
                                searchStudentsQuery.data.map((student: User) => (
                                    <button
                                        key={student.id}
                                        onClick={() => handleDropdownSelect(student)}
                                        className="flex flex-row hover:bg-foreground px-4 py-3 first:rounded-t-[8] last:rounded-b-[8] w-full overflow-visible text-font text-left transition-colors"
                                    > 
                                        <p className="flex-grow">{student.firstName} {student.lastName}</p><p className="mr-2 text-gray-500">{student.id}</p>
                                    </button>
                                ))
                            ) : (
                                <div className="p-3 text-gray-400 text-sm text-center">No students found</div>
                            ))}
                            
                          
                        </div>
                    )}
                </div>
                <div className="flex justify-between mt-2 w-full">
                    <div className="flex gap-4">
                        <StandardButton label="Cancel" onClick={handleModalClose} className="bg-lightforeground px-6 py-3" />
                        <StandardButton label="Add" onClick={handleSubmit} className="bg-lightforeground hover:bg-contrast px-6 py-3 hover:text-background" disabled={isCreateDisabled} />
                    </div>
                </div>
            </div>
        </StandardModal>
    )
}


