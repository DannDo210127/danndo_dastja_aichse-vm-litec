'use client'
import { StandardButton } from "@/shared/StandardButton"
import { ChevronDown, ChevronUp, ComputerIcon, Icon, Pause, Play, PlusIcon, Trash2, TrashIcon, User } from "lucide-react";
import { useState } from "react";

export default function ClassroomPage(){
    return (
           <div className="flex flex-col w-full h-screen">
               <div className="flex flex-row w-full h-1/6 bg-background">
                    <StandardButton label="Create Classroom" onClick={() => {}} className="m-12 mb-3 ml-40 self-end"/>
               </div>
               <Classroom/>
           </div>
       )
}

interface Student {
  id: number;
  name: string;
  assignedVMs?: string[];
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
    students: Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      name: `student ${i + 1}`,
      assignedVM: [
            {
              id: 1,
              name: "Ubuntu VM",
              state: 'running'
            },
            {
              id: 2,
              name: "Debian 12",
              state: 'stopped'
            }
      ],
    })),
  },
  {
    id: 2,
    name: "4AHIT",
    students: [],
  },
];

function Classroom() {
  const [openClassroom, setOpenClassroom] = useState<number | null>(null);

  const toggleClassroom = (id: number) => {
    setOpenClassroom(openClassroom === id ? null : id);
  };

  return (
    <div className="p-8 space-y-4">
      {classroomsData.map((classroom) => {
        const isOpen = openClassroom === classroom.id;

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
                <StandardButton className="px-2 py-1" label="Add student">
                  <PlusIcon className="size-6" />
                </StandardButton>
                <StandardButton className="px-2 py-1" label="Delete classroom">
                  <TrashIcon className="size-6" />
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
    students: {
        id: number;
        name: string;
        assignedVM?: {
            id: number;
            name: string;
            state: 'running' | 'stopped';
        }[];
    }[];

    
}

export function StudentList({ students }: StudentListProps) {
    return (
        <ul className="space-y-2">
            {students.map(student => (
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
                            <VmComponent assignedVMs={student.assignedVM}></VmComponent>
                            <Icon iconNode={[]} className="w-fit ml-4 size-6"><Trash2 /></Icon>
                        </div>
                    </div>
            </li>
            ))}
        </ul>
    );
}

interface VmComponentProps {
    assignedVMs?: {
        id: number;
        name: string;
        state: 'running' | 'stopped';
    }[];
}



export function VmComponent({ assignedVMs }: VmComponentProps) {

    const [state, setState] = useState<string[]>(assignedVMs?.map(vm => vm.state) ?? []);

    function toggleState(vmId: number) {
         assignedVMs?.map(vm =>{
            if (vm.id === vmId) {
                if (vm.state === 'stopped') {
                    setState((previousValue) => {
                        const newState = [...previousValue];
                        newState[vmId] = 'running';
                        return newState;
                    });
                }else if (vm.state === 'running') {
                    setState((previousValue) => {
                        const newState = [...previousValue];
                        newState[vmId] = 'stopped';
                        return newState;
                    });
                }
            }
         })
    }

    return (
       
           <ul className="flex flex-row w-full justify-end h-full space-x-3">
                {assignedVMs?.map(assignedVM => (
                    <li key={assignedVM.id}>

                        <div className="flex flex-row w-fit h-full items-center bg-foreground rounded-[8]">
                            <ComputerIcon className="w-6 h-6 m-1 ml-2" />
                            <span className="mx-2">{assignedVM.name}</span>
                            {assignedVM.state === 'stopped' ? (
                                <Play className="size-5 mr-2" onClick={() => (toggleState(assignedVM.id), console.log('Play clicked'))} />
                            ) : (
                                <Pause className="size-5 mr-2" onClick={() => (toggleState(assignedVM.id), console.log('Pause clicked'))} />
                            )}
                        </div>
                    </li>
                    
                ))}
           </ul>
       
    );
}



