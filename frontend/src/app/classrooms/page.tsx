'use client'
import { StandardButton } from "@/shared/StandardButton"
import { ChevronDown, ChevronUp, ComputerIcon, Icon, Pause, Play, PlusIcon, Trash2, TrashIcon, User } from "lucide-react";
import { useState } from "react";
import { ClassroomModal } from "@/components/ClassroomModal";
import { StudentModal } from "@/components/StudentModal";
import { DeleteClassroomModal } from "@/components/DeleteClassroomModal";
import { DeleteStudentModal } from "@/components/DeleteStudentModal";

export default function ClassroomPage(){


    const [classrooms, setClassrooms] = useState<Classroom[]>(classroomsData);

    const addClassroom = (name: string) => {
      const newClassroom: Classroom = {
        id: classrooms.length + 1,
        name,
        students: [],
      };
      setClassrooms((prev) => [...prev, newClassroom]);
    };
    const handleClassroomSubmit = (inputValue: string) => {
        console.log(classroomsData)
        addClassroom(inputValue);

    };



    


    const [isClassroomModalOpen, setClassroomModalOpen] = useState(false);


    return (
           <div className="flex flex-col w-full h-screen">
               <div className="flex flex-row w-full h-1/12 bg-background items-center">
                    <StandardButton label="Create Classroom" onClick={() => {setClassroomModalOpen(true)}} className="mt-5 px-4 ml-8">
                        <PlusIcon className="size-6 mr-1" />
                    </StandardButton>
               </div>
                <Classroom classrooms={classrooms}/>
               <ClassroomModal  isOpen={isClassroomModalOpen} onClose={() => setClassroomModalOpen(false)} onSubmit={(value) => {handleClassroomSubmit(value); setClassroomModalOpen(false);}} />

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

function Classroom({ classrooms }: ClassroomProps) {

  const [openClassroomIds, setOpenClassroomIds] = useState<number[]>([]);
  console.log("open classrooms at start", openClassroomIds);
  
  const toggleClassroom = (id: number) => {
    setOpenClassroomIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleStudentSubmit = (classid: number, inputValue: string) => {
    console.log(classid)
        console.log(classrooms)
        addStudent(classid, inputValue);

    };


  const addStudent = (classid: number, name: string) => {
    
      const newStudent: Student = {
        id: classrooms[classid].students.length + 1,
        name,
        assignedVM: { id: classrooms[classid].students.length + 201, name: "debian", state: "stopped" }, //{placeholder for id because not worked with backend}
      };
        classrooms[classid].students.push(newStudent);
        console.log(openClassroomIds, classid+1)
        if(openClassroomIds.includes(classid+1) === false){
          toggleClassroom(classid+1);
      } 
    };
    

  const [isStudentModalOpen, setStudentModalOpen] = useState(false);
  const [studentModalClassroomId, setStudentModalClassroomId] = useState<number | null>(null);
  const [isDeleteClassroomModalOpen, setDeleteClassroomModalOpen] = useState(false);
  const [deleteClassroomId, setDeleteClassroomId] = useState<number | null>(null);
  

  const handleDeleteClassroom = (index: number) => {
    classrooms.splice(index, 1);
  };
  

  return (
    <div className="p-8 space-y-4 overflow-y-auto flex-1">
      {classrooms.map((classroom, index) => {
        const isOpen = openClassroomIds.includes(classroom.id);
      
        return (
          <div key={classroom.id} className="rounded-[8] bg-foreground">
            {/* Header */}
            <div className="flex items-center px-4 py-2 cursor-pointer" >

              <div className="flex-1 flex items-center space-x-4" onClick={() => toggleClassroom(classroom.id)} >  
                {isOpen ? 
                    <ClassButton label={classroom.name} icon={<ChevronUp size={18} />} /> : 
                    <ClassButton label={classroom.name} icon={<ChevronDown size={18} />} />}
              </div>
            
              <div className="flex flex-row space-x-2">
                <StandardButton className="px-2 py-1" label="Add student" onClick={() => { setStudentModalClassroomId(index); setStudentModalOpen(true); }}>
                  <PlusIcon className="size-6 mr-1" />
                </StandardButton>
                <StandardButton className="px-2 py-1" label="Delete classroom" onClick={() => { setDeleteClassroomId(index); setDeleteClassroomModalOpen(true); }}>
                  <TrashIcon className="size-6 mr-1" />
                </StandardButton>
              </div>

            </div>

          

            {/* Dropdown / Collapsible Section */}
            {isOpen && (
              <div className="p-4 transition-all duration-300">
                {classroom.students.length > 0 ? (

                  <StudentList students={classroom.students}></StudentList>
                ) : (
                  <p className="text-sm text-gray-500">No students yet.</p>
                )}
              </div>
            )}
      
      <StudentModal 
        isOpen={isStudentModalOpen} 
        onClose={() => {
          setStudentModalOpen(false);
          setStudentModalClassroomId(null);
        }} 
        onSubmit={(value) => { 
          if (studentModalClassroomId !== null) {
            handleStudentSubmit(studentModalClassroomId, value); 
          }
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
   students: Student[];
}

export function StudentList({ students }: StudentListProps) {

  const [isDeleteStudentModalOpen, setDeleteStudentModalOpen] = useState(false);
  const [deleteStudentId, setDeleteStudentId] = useState<number | null>(null);

  const handleDeleteStudent = (studentId: number) => {
    students.splice(studentId, 1);
  };
    return (
        <ul className="space-y-2">
            {students.map((student, index) => (
                <li
                    key={student.id}
                    className="flex justify-between items-center px-3 py-2 bg-white rounded-[8]"
                >
                    <div className="flex flex-row w-full">
                        <div className="flex flex-row w-fit items-center">
                            <Icon iconNode={[]} className="w-fit size-6"><User /></Icon>
                            <span className="ml-3">{student.name}</span>
                        </div>
                        <div className="flex flex-row grow justify-end items-center">
                            <VmComponent assignedVM={student.assignedVM}></VmComponent>
                            <button className="w-fit ml-4 size-6 bg-background" onClick={() => {setDeleteStudentId(index);setDeleteStudentModalOpen(true);}}>
                              <Trash2 size={22}/>
                            </button>
                        </div>
                    </div>
            </li>
            ))}
             <DeleteStudentModal isOpen={isDeleteStudentModalOpen} onClose={() => setDeleteStudentModalOpen(false)} onSubmit={() => {
                    if (deleteStudentId !== null) {
                      handleDeleteStudent(deleteStudentId);
                    }
                    setDeleteStudentModalOpen(false);
                    setDeleteStudentId(null);
            }} />
        </ul>
        
     

    );


}


interface VmComponentProps {
    assignedVM?: {
        id: number;
        name: string;
        state: 'running' | 'stopped';
    };
}



export function VmComponent({ assignedVM }: VmComponentProps) {

    const [state, setState] = useState<string[]>(assignedVM?.state ? [assignedVM.state] : []);

    function toggleState(assignedVM: { id: number; state: 'running' | 'stopped' }) {
         
        if(assignedVM.state === 'running'){
            console.log('Stopping VM...');
            setState(['stopped']);
        }else if(assignedVM.state === 'stopped'){
            console.log('Starting VM...');
            setState(['running']);
        }
            
    }

    return (
       <ul className="flex flex-row w-full justify-end h-full space-x-3">
           {assignedVM && (
               <li key={assignedVM.id}>

                        <div className="flex flex-row w-fit h-full items-center bg-foreground rounded-[8]">
                            <ComputerIcon className="w-6 h-6 m-1 ml-2" />
                            <span className="mx-2">{assignedVM.name}</span>
                            {assignedVM.state === 'running' ? (
                              <button
                                onClick={() => (toggleState(assignedVM), console.log('Play clicked'))}
                              >
                                <Play className="size-5 mr-2" />
                              </button>
                            ) : (
                              <button
                                onClick={() => (toggleState(assignedVM), console.log('Pause clicked'))}
                              >
                                <Pause className="size-5 mr-2" />
                              </button>
                            )}
                        </div>
                    </li>
           )}
      </ul>

   );
}

