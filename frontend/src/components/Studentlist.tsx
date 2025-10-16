import { Icon, User } from "lucide-react";


interface StudentListProps {
    students: {
        id: number;
        name: string;
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
                    <div className="flex flex-row ">
                        <Icon iconNode={[]} className="w-fit"><User /></Icon>
                        <span>{student.name}</span>
                    </div>
                    
                    <button className="text-red-500 hover:text-red-700 text-sm">
                        Remove
                </button>
            </li>
            ))}
        </ul>
    );
}
            