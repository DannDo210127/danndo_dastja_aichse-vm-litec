"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ComputerIcon, PlusIcon, TrashIcon } from "lucide-react";
import { ClassButton } from "./ClassButton";
import { Button } from "@/shared/Button";
import { StudentList } from "./Studentlist";

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

export function Classroom() {
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
                <Button className="px-2 py-1" label="Add student" icon={<PlusIcon className="size-6" />}></Button>
                <Button className="px-2 py-1" label="Delete Classroom" icon={<TrashIcon className="size-6" />}></Button>
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
