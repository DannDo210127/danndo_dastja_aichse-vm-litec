'use client'
import { StandardButton } from "@/shared/StandardButton"
import { ChevronDown, ChevronUp, ComputerIcon, Icon, Pause, Play, PlusIcon, Trash2, Trash2Icon, User as UserIcon } from "lucide-react";
import { FC, Suspense, use, useEffect, useState } from "react";
import { StandardInput } from "@/shared/StandardInput";
import StandardModal from "@/shared/StandardModal";
import { ConfirmModal } from "@/shared/ConfirmModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addStudentToClassroom, createClassroom, deleteClassroom, getAllClassrooms, getAllStudentsInClassroom, removeStudentFromClassroom } from "@/api/classroom";
import  UserApi  from "@/api/user";
import { LoadingScreen } from "@/shared/LoadingScreen";
import { useAuth } from "@/hooks/useAuth";
import { LoginModal } from "@/components/LoginModal";
import Snackbar from "@/shared/Snackbar";

// Types from database schema
interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roleId: number;
}

interface ClassroomUser {
  id: number;
  classroomId: number;
  userId: number;
  user: User;
}

interface Classroom {
  id: number;
  name: string;
  description?: string;
  users: ClassroomUser[];
}




export default function ClassroomPage(){
    const [isClassroomModalOpen, setClassroomModalOpen] = useState(false);

    const classrooms = useQuery({
      queryKey: ['classrooms'],
      queryFn: () => getAllClassrooms(),
      
    });




    const createClassroomMutation = useMutation({
      mutationFn: ({ name, description }: { name: string; description: string }) => createClassroom(name, description),
      onSuccess: () => {
        classrooms.refetch();
        setClassroomModalOpen(false);
      }
    });

    const deleteClassroomMutation = useMutation({
      mutationFn: (classroomId: number) => deleteClassroom(classroomId),
      onSuccess: () => {
        classrooms.refetch();
      }
    });

    const user = useAuth();

    // errormessage for create-classroom modal
    const [classroomErrormessage, setClassroomErrormessage] = useState<string>("");
    
    const handleAddClassroom = (name: string, description: string) => {
      createClassroomMutation.mutate({ name, description });
      setClassroomModalOpen(false);
    };

    const handleClassroomSubmit = (name: string, description: string) => {
          setClassroomErrormessage("");
         
        const exists = classrooms.data?.some((classroom: { name: string; }) => classroom.name.toLowerCase() === name.toLowerCase());
        if(exists){
          setClassroomErrormessage("Classroom with this name already exists!");
          setClassroomModalOpen(true);
        }else{
          name = name.trim().toUpperCase();
          description = description.trim();
          handleAddClassroom(name, description);
          setClassroomErrormessage("");
          
        }
    };

    const [isLoginModalOpen, setLoginModalOpen] = useState(false);

    useEffect(() => {
      if (!user.isAuthenticated) {
        setLoginModalOpen(true);
      }
      classrooms.refetch();
    }, [user.isAuthenticated]);


    return (
      classrooms.isFetching ? <LoadingScreen /> : 
       !user.isAuthenticated ? <LoginModal isOpen={isLoginModalOpen} onClose={() => setLoginModalOpen(false)} onSubmit={() => setLoginModalOpen(false)} /> :
                           

           <div className="flex flex-col bg-background m-20 rounded-[8] w-8/10 h-8/10">
               <div className="flex flex-row justify-between items-center bg-background border-lightforeground border-b-2 w-full h-1/12">
                    <h2 className="m-5 p-2 font-bold text-2xl">Your Classrooms</h2>
                    <StandardButton label="Create Classroom" onClick={() => {setClassroomModalOpen(true)}} className="bg-lightforeground hover:bg-contrast! drop-shadow-sm ml-8 p-2.5! px-4 hover:text-background hover:scale-105 transition-all">
                        <PlusIcon className="mr-1 size-6" />
                    </StandardButton>
               </div>
                <ClassroomComponent classrooms={classrooms.data || []} setClassrooms={() => {}} deleteClassroomMutation={deleteClassroomMutation}/>
                <ClassroomModal errormessage={classroomErrormessage} isOpen={isClassroomModalOpen} onClose={() => {setClassroomModalOpen(false);}} onSubmit={(name, description) => {handleClassroomSubmit(name, description);}} />
           </div>
          
      )
}


interface ClassroomProps {
  deleteClassroomMutation: any;
}

function ClassroomComponent({deleteClassroomMutation, classrooms }: ClassroomProps & { setClassrooms: React.Dispatch<React.SetStateAction<Classroom[]>>, classrooms: Classroom[] }) {

  const [openClassroomIds, setOpenClassroomIds] = useState<number[]>([]);
  console.log("open classrooms at start", openClassroomIds);
  
  const toggleClassroom = (id: number) => {
    setOpenClassroomIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const [isDeleteClassroomModalOpen, setDeleteClassroomModalOpen] = useState(false);
  const [deleteClassroomId, setDeleteClassroomId] = useState<number | null>(null);


  const [isStudentModalOpen, setStudentModalOpen] = useState(false);
  const [studentModalClassroomId, setStudentModalClassroomId] = useState<number | null>(null);
  const [studentErrormessage, setStudentErrormessage] = useState<string>("");

  const queryClient = useQueryClient();

  const addStudentToClassroomMutation = useMutation({
    mutationFn: ({ classroomId, userId }: { classroomId: number; userId: number }) => {
      return addStudentToClassroom(classroomId, userId);
    },
    onSuccess:()=>{
      queryClient.invalidateQueries({ queryKey: ['classrooms'] })
    }    
  });
    

  


  const handleDeleteClassroom = (index: number) => {
      deleteClassroomMutation.mutate(classrooms[index].id);
  };
  
  

  return (
    <div className="flex-1 space-y-4 bg-background p-8 max-h-[calc(100vh-10rem)] overflow-y-auto">
      {classrooms.map((classroom: Classroom, index: number) => {
        const isOpen = openClassroomIds.includes(classroom.id);
        
        return (
          <div key={classroom.id} className={`bg-background shadow-md border-2 border-lightforeground ${isOpen ? "rounded-t-[8]" : "rounded-[8]"}`}>
            {/* Header */}
            <div className={`flex items-center bg-lightforeground drop-shadow-sm px-4 py-2 border-lightforeground border-b-2 ${isOpen ? "rounded-t-[4]" : "rounded-[4]"} cursor-pointer`} >

              <div className="flex flex-1 items-center space-x-4" onClick={() => toggleClassroom(classroom.id)} >  
                {isOpen ? 
                    <ClassButton className="bg-transparent!" label={classroom.name} icon={<ChevronUp size={18} />} /> : 
                    <ClassButton className="bg-transparent!" label={classroom.name} icon={<ChevronDown size={18} />} />}
              </div>
            
              <div className="flex flex-row space-x-2">
                <StandardButton className="bg-transparent! px-2 py-1" label="Add student" onClick={() => { setStudentModalClassroomId(index); setStudentModalOpen(true); }}>
                  <PlusIcon className="mr-1 size-6" />
                </StandardButton>
                <StandardButton className="bg-transparent! px-2 py-1" label="" onClick={() => { setDeleteClassroomId(index); setDeleteClassroomModalOpen(true); }}>
                  <Trash2Icon className="size-6" />
                </StandardButton>
              </div>

            </div>

          

            {/* Dropdown / Collapsible Section */}
            {isOpen && (
              <div className="p-4 transition-all duration-300">
                  <StudentList classroomId={classroom.id}></StudentList>
              </div>
            )}
      
      <StudentModal 
        errormessage={studentErrormessage}
        isOpen={isStudentModalOpen}
        classroomId={studentModalClassroomId !== null ? classrooms[studentModalClassroomId]?.id : undefined}
        onClose={() => {
          setStudentModalOpen(false);
          setStudentModalClassroomId(null);
        }} 
   
      />
      <DeleteClassroomModal isOpen={isDeleteClassroomModalOpen} onClose={() => setDeleteClassroomModalOpen(false)} onSubmit={() => {
        if (deleteClassroomId !== null) {
          handleDeleteClassroom(deleteClassroomId);
        }
        setDeleteClassroomModalOpen(false);
        setDeleteClassroomId(null);
      }} />
    </div>
          
        );
      })}
    </div>
  );
}

interface ClassButtonProps {
  icon?: React.ReactNode;
  label: string;
  onclick?: () => void;
  className?: string;
}



export function ClassButton({
  icon,
  label,
  onclick,
  className,
}: ClassButtonProps) {


  return (
    <button
      onClick={onclick}
      className={"flex items-center rounded-[8] p-2 bg-foreground" + 
                (className ? " " + className : "")}
    >
      <span className="">{label}</span>
      {icon && <span className="mr-4">{icon}</span>}
    </button>
  );
}


interface StudentListProps {
  classroomId?: number;
}

export function StudentList({ classroomId }: StudentListProps) {

  const [isDeleteStudentModalOpen, setDeleteStudentModalOpen] = useState(false);
  const [deleteStudentId, setDeleteStudentId] = useState<number | null>(null);

  const queryClient = useQueryClient();

  const students = useQuery({
    queryKey: ['students', classroomId],
    queryFn: () => getAllStudentsInClassroom(classroomId!),
  })

  const removeStudent = useMutation({
    mutationFn: (userId: number) => {
      return removeStudentFromClassroom(classroomId!, userId);
    },
    onSuccess:()=>{
      queryClient.invalidateQueries({ queryKey: ['students'] })
    }});
  
    return (
        <ul className="space-y-2">
            {students.isLoading && <div>Loading...</div>}
            {students.data?.length <= 0 ? 
            <div>Nobody is here :(</div> : 
            students.data?.map((student: any, index: number) => (
                <li
                    key={student.id}
                    className="flex justify-between items-center bg-background px-3 py-2 rounded-[8]"
                >

                    <div className="flex flex-row w-full">
                        <div className="flex flex-row items-center w-fit">
                            <Icon iconNode={[]} className="w-fit size-6"><UserIcon /></Icon>
                            <span className="ml-3">{student.user.firstName} {student.user.lastName}</span>
                        </div>
                        <div className="flex flex-row justify-end items-center grow">
                            <button className="bg-background hover:bg-secondary ml-4 rounded-[8] w-fit size-8" onClick={() => {setDeleteStudentId(student.user.id);setDeleteStudentModalOpen(true);}}>
                              <Trash2 className="size-6"/>
                            </button>
                        </div>
                    </div>
            </li>
            ))
            }
             <DeleteStudentModal isOpen={isDeleteStudentModalOpen} onClose={() => setDeleteStudentModalOpen(false)} onSubmit={() => {
                    setDeleteStudentModalOpen(false);
                    removeStudent.mutate(deleteStudentId!);
                    setDeleteStudentId(null);
            }} />
        </ul>
        
     

    );


}

// Modals for ClassroomHandling


interface ClassroomModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string, description: string) => void;
    errormessage: string;
}


export function ClassroomModal({isOpen, onClose, onSubmit, errormessage}: ClassroomModalProps) {

    const [classroomName, setClassroomName] = useState<string>("");
    const [classroomDescription, setClassroomDescription] = useState<string>("");
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
        setShowError(true);
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
            }else if(e.key === "Escape"){
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
        <StandardModal className="w-96" title={"Create Classroom"} description={""} isOpen={isOpen}>
            <div className="flex flex-col space-y-4 mt-4">
                <StandardInput  placeholder="Classname" onValueChange={(value: string) => setClassroomName(value)} />
                <StandardInput  placeholder="add description" onValueChange={(value: string) => setClassroomDescription(value)} />
                <div 
                    className={`
                        overflow-hidden transition-all duration-300 ease-in-out
                        ${showError && errormessage ? 'max-h-20 opacity-100 py-2 px-4' : 'max-h-0 opacity-0'}
                        bg-red-400 rounded-[8] text-font text-sm 
                    `}
                >
                    {errormessage}
                </div>
                
                <div className="flex justify-between mt-2 w-full">
                    <div className="flex gap-4 w-full">
                        <StandardButton label="Cancel" onClick={onClose} className="bg-lightforeground px-6 py-3" />
                        <StandardButton label="Create" onClick={handleSubmit} className={"ml-1 h-full px-10 py-3 bg-lightforeground "+(isCreateDisabled ? "" : "bg-contrast! text-background")} disabled={isCreateDisabled} />
                    </div>
                </div>
            </div>
        </StandardModal>
    )
}


interface DeleteClassroomModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
}


export function DeleteClassroomModal({ isOpen, onClose, onSubmit }: DeleteClassroomModalProps) {
    return (
       <ConfirmModal title={"Delete Classroom"} description={"Are you sure you want to delete this classroom? This action cannot be undone."} isOpen={isOpen} onClose={onClose} onConfirm={() => onSubmit()} />
    )
}



// Modals for StudentHandling




interface StudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    errormessage: string;
    classroomId?: number;
}

export function StudentModal({isOpen, onClose, errormessage, classroomId}: StudentModalProps) {
    const [showError, setShowError] = useState<boolean>(false);
    const [studentInput, setStudentInput] = useState<[string,number]>(["", 0]);
    const [selectedStudent, setSelectedStudent] = useState<[string,number]>(["", 0]);

    const [showDropdown, setShowDropdown] = useState<boolean>(false);

     const [isCreateDisabled, setIsCreateDisabled] = useState<boolean>(studentInput[0].trim() === selectedStudent[0].trim());

   

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
        },
        onError: () => {
            setShowError(true);
        }
    });

    useEffect(() => {
        if (!isOpen) {
            setShowError(false);
            setStudentInput(["", 0]);
            setShowDropdown(false);
        }
    }, [isOpen]);

    useEffect(() => {
        if (errormessage) {
            setShowError(true);
        }
    }, [errormessage]);

    const handleModalClose = () => {
        setShowError(false);
        setStudentInput(["", 0]);
        setShowDropdown(false);
        onClose();
    };

    const handleSubmit = () => {
        // Check if input is empty
        if (studentInput[0].trim() === "") {
            setShowError(true);
            return;
        }
        
        // Check if input matches selected student
        if (studentInput[0].trim() !== selectedStudent[0].trim()) {
            setShowError(true);
            return;
        }
        
        // Check if a student was actually selected (has valid ID)
        if (selectedStudent[1] === 0) {
            setShowError(true);
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

                <div 
                    className={`
                        overflow-hidden transition-all duration-300 ease-in-out
                        ${showError && (errormessage || studentInput[0].trim() === "" || studentInput[0].trim() !== selectedStudent[0].trim() || selectedStudent[1] === 0) ? 'max-h-20 opacity-100 py-2 px-4' : 'max-h-0 opacity-0'}
                        bg-red-400 rounded-[8] text-font text-sm 
                    `}
                >
                    {errormessage || (studentInput[0].trim() === "" ? "Please enter a student name" : studentInput[0].trim() !== selectedStudent[0].trim() ? "Please select a student from the dropdown list" : selectedStudent[1] === 0 ? "Please select a valid student" : "")}
                </div>              
                <div className="flex justify-between mt-2 w-full">
                    <div className="flex gap-4">
                        <StandardButton label="Cancel" onClick={handleModalClose} className="bg-lightforeground px-6 py-3" />
                        <StandardButton label="Add" onClick={handleSubmit} className="bg-lightforeground px-6 py-3" disabled={isCreateDisabled} />
                    </div>
                </div>
            </div>
        </StandardModal>
    )
}




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

