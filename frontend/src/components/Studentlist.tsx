import { DeleteIcon, Icon, Trash2, User } from "lucide-react";
import { VmComponent } from "./VmComponent";


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
            