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
import { useErrorStore } from '@/store/error-store';
import { DeleteStudentModal } from "@/components/deleteStudentModal";
import { ClassroomModal } from "@/components/createClassroomModal";
import { DeleteClassroomModal } from "@/components/deleteClassroomModal";
import { AddStudentModal } from "@/components/addStudentModal";


interface ClassroomProps {
  deleteClassroomMutation: any;
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
                           
           <div className="flex flex-col bg-background m-20 mx-30 rounded-[8] h-8/10 grow">
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


function ClassroomComponent({deleteClassroomMutation, classrooms }: ClassroomProps & { setClassrooms: React.Dispatch<React.SetStateAction<Classroom[]>>, classrooms: Classroom[] }) {

  const [openClassroomIds, setOpenClassroomIds] = useState<number[]>([]);  
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


  const handleDeleteClassroom = (index: number) => {
      deleteClassroomMutation.mutate(classrooms[index].id);
      
  };
  
  

  return (
    <div className="flex-1 space-y-4 bg-background p-8 max-h-[calc(100vh-10rem)] overflow-y-auto">
      {classrooms.map((classroom: Classroom, index: number) => {
        const isOpen = openClassroomIds.includes(classroom.id);
        
        return (
          <div key={classroom.id} className={`bg-background shadow-md border-2 border-lightforeground rounded-[8] transition-all duration-300`}>
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
      
      <AddStudentModal 
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




interface StudentListProps {
  classroomId?: number;
}

export function StudentList({ classroomId }: StudentListProps) {

  const [isDeleteStudentModalOpen, setDeleteStudentModalOpen] = useState(false);
  const [deleteStudentId, setDeleteStudentId] = useState<number | null>(null);

  const { showError, showSuccess } = useErrorStore();

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
      showSuccess("Student removed from classroom successfully");
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




interface ClassButtonProps {
  icon?: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
}

export function ClassButton({
  icon,
  label,
  onClick,
  className,
}: ClassButtonProps) {


  return (
    <button
      onClick={onClick}
      className={"flex items-center rounded-[8] p-2 bg-foreground" + 
                (className ? " " + className : "")}
    >
      <span className="">{label}</span>
      {icon && <span className="mr-4">{icon}</span>}
    </button>
  );
}
