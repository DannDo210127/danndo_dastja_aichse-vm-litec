'use client'
import { StandardButton } from "@/shared/StandardButton"
import { ChevronDown, ChevronUp, ComputerIcon, Icon, Pause, Play, PlusIcon, Trash2, Trash2Icon, User } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { StandardInput } from "@/shared/StandardInput";
import StandardModal from "@/shared/StandardModal";
import { ConfirmModal } from "@/shared/ConfirmModal";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllClassrooms, getAllStudentsInClassroom, removeStudentFromClassroom } from "@/api/classroom";

export default function ClassroomPage(){


    const [classrooms, setClassrooms] = useState<Classroom[]>(classroomsData);

    // errormessage for create-classroom modal
    const [classroomErrormessage, setClassroomErrormessage] = useState<string>("");
    
    const addClassroom = (name: string) => {
      const newClassroom: Classroom = {
        id: classrooms.length + 1,
        name,
        students: [],
      };
      setClassrooms((prev) => [...prev, newClassroom]);
    };

    const handleClassroomSubmit = (inputValue: string) => {
          setClassroomErrormessage("");
         
        const exists = classrooms.some(classroom => classroom.name.toLowerCase() === inputValue.toLowerCase());
        if(exists){
          setClassroomErrormessage("Classroom with this name already exists!");
          setClassroomModalOpen(true);
        }else{
          inputValue = inputValue.trim();
          inputValue = inputValue.toUpperCase();
          addClassroom(inputValue);
          setClassroomErrormessage("");
          setClassroomModalOpen(false);
        }
    };


    const [isClassroomModalOpen, setClassroomModalOpen] = useState(false);

    return (
           <div className="flex flex-col m-20 w-8/10 h-8/10 rounded-[8] bg-background">
               <div className="flex flex-row justify-between w-full h-1/12 bg-background border-b-2 border-lightforeground items-center">
                    <h2 className="m-5 p-2 text-2xl font-bold">Your Classrooms</h2>
                    <StandardButton label="Create Classroom" onClick={() => {setClassroomModalOpen(true)}} className=" px-4 ml-8 bg-lightforeground drop-shadow-sm p-2.5! hover:bg-contrast! hover:scale-105 transition-all hover:text-background">
                        <PlusIcon className="size-6 mr-1" />
                    </StandardButton>
               </div>
                <Classroom classrooms={classrooms} setClassrooms={setClassrooms}/>
               <ClassroomModal errormessage={classroomErrormessage} isOpen={isClassroomModalOpen} onClose={() => {setClassroomModalOpen(false);}} onSubmit={(value) => {handleClassroomSubmit(value);}} />

           </div>

           
       )
}



interface Student {
  id: number;
  name: string;
  assignedVM?: {
    id:number;
    name: string;
    state: 'running' | 'stopped';
  };
}



interface Classroom {
  id: number;
  name: string;
  students: Student[];
}

const classroomsData: Classroom[] = [
  {
    id: 1,
    name: "5AHIT",
    students:[
      {
        id: 1,
        name: "Alice Müller",
        assignedVM: { id: 201, name: "debian", state: "stopped" },
      },
      {
        id: 2,
        name: "Ben Schmidt",
        assignedVM: { id: 202, name: "debian", state: "stopped" },
      },
      {
        id: 3,
        name: "Carla Novak",
        assignedVM: { id: 203, name: "debian", state: "stopped" },
      },
      {
        id: 4,
        name: "Daniel Rossi",
        assignedVM: { id: 204, name: "debian", state: "stopped" },
      },
      {
        id: 5,
        name: "Elena García",
        assignedVM: { id: 204, name: "debian", state: "stopped" },
      },
      {
        id: 6,
        name: "Filip Nowak",
        assignedVM: { id: 205, name: "debian", state: "stopped" },
      },
      {
        id: 7,
        name: "Greta Svensson",
        assignedVM: { id: 206, name: "debian", state: "stopped" },
      },
      {
        id: 8,
        name: "Hugo Dubois",
        assignedVM: { id: 205, name: "debian", state: "stopped" },
      }
    

    ],
  },
  {
    id: 2,
    name: "4BHIT",
    students: [],
  },
];

interface ClassroomProps {
  classrooms: Classroom[];
}

function Classroom({ classrooms: _classrooms, setClassrooms }: ClassroomProps & { setClassrooms: React.Dispatch<React.SetStateAction<Classroom[]>> }) {

  const [openClassroomIds, setOpenClassroomIds] = useState<number[]>([]);
  console.log("open classrooms at start", openClassroomIds);
  
  const toggleClassroom = (id: number) => {
    setOpenClassroomIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  

 


  const [isStudentModalOpen, setStudentModalOpen] = useState(false);
  const [studentModalClassroomId, setStudentModalClassroomId] = useState<number | null>(null);
  const [studentErrormessage, setStudentErrormessage] = useState<string>("");


  //const handleStudentSubmit = (classid: number, inputValue: string) => {
    //setStudentErrormessage(""); // Reset error at start
    
    //const exists = classrooms[classid].students.some((student: Student) => student.name.toLowerCase() === inputValue.toLowerCase());

    //if(exists){
      //setStudentErrormessage("Student with this name already exists!");
      //setStudentModalOpen(true);
    //} else {
      //inputValue = inputValue.trim();
      //let names = inputValue.split(" ");
      //for (let i = 0; i < names.length; i++) {
        //names[i] = names[i].charAt(0).toUpperCase() + names[i].slice(1).toLowerCase();
      //}
      //inputValue = names.join(" ");
      //addStudent(classid, inputValue);
      //setStudentErrormessage(""); // Clear error on success
      //setStudentModalOpen(false); // Close modal on success
      //setStudentModalClassroomId(null);
    //}
  //};


  //const addStudent = (classroomIndex: number, name: string) => {
    //const classroom = classrooms[classroomIndex];
    
    //const newStudent: Student = {
      //id: classroom.students.length > 0 
        //? Math.max(...classroom.students.map(s => s.id)) + 1 
        //: 1,
      //name,
      //assignedVM: { 
        //id: classroom.students.length > 0 
          //? Math.max(...classroom.students.map(s => s.assignedVM?.id || 0)) + 1 
          //: 201, 
        //name: "debian", 
        //state: "stopped" 
      //},
    //};
    
    //// Use setClassrooms to properly update state (don't mutate directly)
    //setClassrooms((prev) => {
      //const updated = [...prev];
      //updated[classroomIndex] = {
        //...updated[classroomIndex],
        //students: [...updated[classroomIndex].students, newStudent]
      //};
      //return updated;
    //});
    
    //// Open the classroom if it's not already open
    //if(!openClassroomIds.includes(classroom.id)){
      //toggleClassroom(classroom.id);
    //} 
//};
    

  
  const [isDeleteClassroomModalOpen, setDeleteClassroomModalOpen] = useState(false);
  const [deleteClassroomId, setDeleteClassroomId] = useState<number | null>(null);

  //const handleDeleteClassroom = (index: number) => {
    //classrooms.splice(index, 1);
  //};
  
  const classrooms = useQuery({
    queryKey: ['classrooms'],
    queryFn: () => getAllClassrooms(),
  });

  return (
    <div className="p-8 space-y-4 overflow-y-auto flex-1 max-h-[calc(100vh-10rem)]">
      {classrooms.data?.map((classroom: any, index: number) => {
        const isOpen = openClassroomIds.includes(classroom.id);
      
        return (
          <div key={classroom.id} className="rounded-[8] bg-background border-2 border-lightforeground drop-shadow-sm">
            {/* Header */}
            <div className="flex items-center px-4 py-2 cursor-pointer border-b-2 border-lightforeground bg-lightforeground" >

              <div className="flex-1 flex items-center space-x-4" onClick={() => toggleClassroom(classroom.id)} >  
                {isOpen ? 
                    <ClassButton className="bg-transparent!" label={classroom.name} icon={<ChevronUp size={18} />} /> : 
                    <ClassButton className="bg-transparent!" label={classroom.name} icon={<ChevronDown size={18} />} />}
              </div>
            
              <div className="flex flex-row space-x-2">
                <StandardButton className="px-2 py-1 bg-transparent!" label="Add student" onClick={() => { setStudentModalClassroomId(index); setStudentModalOpen(true); }}>
                  <PlusIcon className="size-6 mr-1" />
                </StandardButton>
                <StandardButton className="px-2 py-1 bg-transparent!" label="" onClick={() => { setDeleteClassroomId(index); setDeleteClassroomModalOpen(true); }}>
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
        onClose={() => {
          setStudentModalOpen(false);
          setStudentModalClassroomId(null);
        }} 
        onSubmit={(value) => { 
          if (studentModalClassroomId !== null) {
            handleStudentSubmit(studentModalClassroomId, value); 
          }
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


  const students = useQuery({
    queryKey: ['students', classroomId],
    queryFn: () => getAllStudentsInClassroom(classroomId!),
  })

  const removeStudent = useMutation({
    mutationFn: (studentId: number) => {
      return removeStudentFromClassroom(classroomId!, studentId);
    },}
    
  )
  
    return (
        <ul className="space-y-2">
            {students.isLoading && <div>Loading...</div>}
            {students.data?.length <= 0 && <div>No students found.</div>}
            {students.data?.map((student: any, index: number) => (
                <li
                    key={student.id}
                    className="flex justify-between items-center px-3 py-2 bg-background rounded-[8]"
                >

                    <div className="flex flex-row w-full">
                        <div className="flex flex-row w-fit items-center">
                            <Icon iconNode={[]} className="w-fit size-6"><User /></Icon>
                            <span className="ml-3">{student.user.firstName} {student.user.lastName}</span>
                        </div>
                        <div className="flex flex-row grow justify-end items-center">
                            <button className="w-fit ml-4 size-8 rounded-[8] bg-background hover:bg-secondary" onClick={() => {setDeleteStudentId(student.user.id);setDeleteStudentModalOpen(true);}}>
                              <Trash2 className="size-6"/>
                            </button>
                        </div>
                    </div>
            </li>
            ))}
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
    onSubmit: (value: string) => void;
    errormessage: string;
}


export function ClassroomModal({isOpen, onClose, onSubmit, errormessage}: ClassroomModalProps) {

    const [classroomName, setClassroomName] = useState<string>("");
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
        setShowError(true); // Trigger animation when clicking Create
        onSubmit(classroomName);
    };

    return (
        <StandardModal className="w-96" title={"Create Classroom"} description={""} isOpen={isOpen}>
            <div className="flex flex-col space-y-4 mt-4">
                <StandardInput placeholder="Classname" onValueChange={(value: string) => setClassroomName(value)} />
                
                {/* Error message with smooth expand/collapse triggered by button click */}
                <div 
                    className={`
                        overflow-hidden transition-all duration-300 ease-in-out
                        ${showError && errormessage ? 'max-h-20 opacity-100 py-2 px-4' : 'max-h-0 opacity-0'}
                        bg-red-400 rounded-[8] text-font text-sm 
                    `}
                >
                    {errormessage}
                </div>
                
                <div className="flex w-full justify-between mt-2">
                    <div className="flex gap-4">
                        <StandardButton label="Cancel" onClick={onClose} className="px-6 py-3 bg-lightforeground" />
                        <StandardButton label="Create" onClick={() => {handleSubmit();}} className="px-6 py-3 bg-lightforeground" disabled={isCreateDisabled} />
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
    onSubmit: (value: string) => void;
    errormessage: string;
}


export function StudentModal({isOpen, onClose, onSubmit, errormessage}: StudentModalProps) {
    const [showError, setShowError] = useState<boolean>(false);

    const [studentName, setStudentName] = useState<string>("");

    const isCreateDisabled = studentName.trim() === "";

     // Reset error visibility when modal closes
    useEffect(() => {
        if (!isOpen) {
            setShowError(false);
            setStudentName("");
        }
    }, [isOpen]);

    // Show error when errormessage changes and is not empty
    useEffect(() => {
        if (errormessage) {
            setShowError(true);
        }
    }, [errormessage]);

    const handleSubmit = () => {
        setShowError(true); // Trigger animation when clicking Create
        onSubmit(studentName);
    };


    return (
        <StandardModal className="w-96" title={"Add Student"} description={"Enter student name:"} isOpen={isOpen}>
            <div className="flex flex-col space-y-4 mt-4">
                <StandardInput placeholder="Student Name" onValueChange={(value: string) => setStudentName(value)} />
                <div 
                    className={`
                        overflow-hidden transition-all duration-300 ease-in-out
                        ${showError && errormessage ? 'max-h-20 opacity-100 py-2 px-4' : 'max-h-0 opacity-0'}
                        bg-red-400 rounded-[8] text-font text-sm 
                    `}
                >
                    {errormessage}
                </div>              
                <div className="flex w-full justify-between mt-2">
                <div className="flex gap-4">
                    <StandardButton label="Cancel" onClick={onClose} className="px-6 py-3 bg-lightforeground" />
                    <StandardButton label="Create" onClick={() => handleSubmit()} className="px-6 py-3 bg-lightforeground" disabled={isCreateDisabled} />
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



