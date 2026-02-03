'use client';
import { StandardButton } from '@/shared/StandardButton';
import {
  ChevronDown,
  ChevronUp,
  Icon,
  PackagePlus,
  PlusIcon,
  Trash2,
  Trash2Icon,
  User as UserIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createClassroom,
  deleteClassroom,
  getAllClassrooms,
  getAllStudentsInClassroom,
  removeStudentFromClassroom,
} from '@/api/classroom';
import { LoadingScreen } from '@/shared/LoadingScreen';
import { useAuth } from '@/hooks/useAuth';
import { LoginModal } from '@/components/LoginModal';
import { DeleteStudentModal } from '@/components/DeleteStudentModal';
import { CreateClassroomModal } from '@/components/createClassroomModal';
import { DeleteClassroomModal } from '@/components/DeleteClassroomModal';
import { AddStudentModal } from '@/components/AddStudentModal';
import LoadingBounce from '@/shared/LoadingBounce';
import { CreateVirtualMachineModal } from '@/components/CreateVirtualMachineModal';

interface Classroom {
  id: number;
  name: string;
  description: string;
}

/** Root Component */
export default function ClassroomPage() {
  const [isClassroomModalOpen, setClassroomModalOpen] = useState(false);

  const classrooms = useQuery({
    queryKey: ['classrooms'],
    queryFn: () => getAllClassrooms(),
  });

  const createClassroomMutation = useMutation({
    mutationFn: ({
      name,
      description,
    }: {
      name: string;
      description: string;
    }) => createClassroom(name, description),
    onSuccess: () => {
      classrooms.refetch();
      setClassroomModalOpen(false);
    },
  });

  const deleteClassroomMutation = useMutation({
    mutationFn: (classroomId: number) => deleteClassroom(classroomId),
    onSuccess: () => {
      classrooms.refetch();
    },
  });

  const user = useAuth();
  const [classroomErrormessage, setClassroomErrormessage] =
    useState<string>('');
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  const handleClassroomSubmit = (name: string, description: string) => {
    const exists = classrooms.data?.some(
      (classroom: { name: string }) =>
        classroom.name.toLowerCase() === name.toLowerCase(),
    );
    if (exists) {
      setClassroomModalOpen(true);
    } else {
      name = name.trim().toUpperCase();
      description = description.trim();
      createClassroomMutation.mutate({ name, description });
    }
  };

  useEffect(() => {
    if (!user.isAuthenticated) {
      setLoginModalOpen(true);
    }
    classrooms.refetch();
  }, [user.isAuthenticated]);

  return !user.isAuthenticated ? (
    <LoginModal
      isOpen={isLoginModalOpen}
      onClose={() => setLoginModalOpen(false)}
      onSubmit={() => setLoginModalOpen(false)}
    />
  ) : classrooms.isFetching ? (
    <LoadingScreen />
  ) : (
    <div className="flex flex-col bg-background mx-10 xl:mx-20 my-20 rounded-[8] w-9/10 h-8/10">
      <div className="flex flex-row justify-between items-center bg-background border-lightforeground border-b-2 w-full h-1/12">
        <h2 className="m-5 p-2 font-bold text-2xl">Your Classrooms</h2>

        {(user.data?.role.name === 'TEACHER' ||
          user.data?.role.name === 'ADMIN') && (
          <StandardButton
            label="Create Classroom"
            onClick={() => {
              setClassroomModalOpen(true);
            }}
            className="bg-lightforeground hover:bg-contrast! drop-shadow-sm ml-8 p-2.5! px-4 hover:text-background hover:scale-105 transition-all"
          >
            <PlusIcon className="mr-1 size-6" />
          </StandardButton>
        )}
      </div>
      <ClassroomComponent
        classrooms={classrooms.data || []}
        setClassrooms={() => {}}
        deleteClassroomMutation={deleteClassroomMutation}
      />

      {/** Modals */}
      <CreateClassroomModal
        errormessage={classroomErrormessage}
        isOpen={isClassroomModalOpen}
        onClose={() => {
          setClassroomModalOpen(false);
        }}
        onSubmit={(name: string, description: string) => {
          handleClassroomSubmit(name, description);
        }}
      />
    </div>
  );
}

interface ClassroomProps {
  deleteClassroomMutation: any;
  setClassrooms: React.Dispatch<React.SetStateAction<Classroom[]>>;
  classrooms: Classroom[];
}

/** Classroom List Component */
function ClassroomComponent({
  deleteClassroomMutation,
  classrooms,
}: ClassroomProps) {
  const user = useAuth();

  const [openClassroomIds, setOpenClassroomIds] = useState<number[]>([]);
  const [isDeleteClassroomModalOpen, setDeleteClassroomModalOpen] =
    useState(false);
  const [deleteClassroomId, setDeleteClassroomId] = useState<number | null>(
    null,
  );
  const [isStudentModalOpen, setStudentModalOpen] = useState(false);
  const [studentModalClassroomId, setStudentModalClassroomId] = useState<
    number | null
  >(null);

  const [isCreateVirtualMachineModalOpen, setVmModalOpen] = useState(false);

  const toggleClassroom = (id: number) => {
    setOpenClassroomIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  return (
    <div className="flex-1 space-y-4 bg-background p-8 max-h-[calc(100vh-10rem)] overflow-y-auto">
      {classrooms.map((classroom: Classroom, index: number) => {
        const isOpen = openClassroomIds.includes(classroom.id);

        return (
          <div
            key={classroom.id}
            className={`bg-background shadow-md border-2 border-lightforeground rounded-[8]`}
          >
            <div
              className={`flex items-center bg-lightforeground drop-shadow-sm px-4 py-2 border-lightforeground border-b-2 ${isOpen ? 'rounded-t-[4]' : 'rounded-[4]'} cursor-pointer`}
            >
              <div
                className="flex flex-1 items-center space-x-4"
                onClick={() => toggleClassroom(classroom.id)}
              >
                {isOpen ? (
                  <StandardButton
                    className="bg-transparent!"
                    label={classroom.name}
                  >
                    <ChevronUp size={18} className="mr-2" />
                  </StandardButton>
                ) : (
                  <StandardButton
                    className="bg-transparent!"
                    label={classroom.name}
                  >
                    <ChevronDown size={18} className="mr-2" />
                  </StandardButton>
                )}
              </div>

              <div className="flex flex-row space-x-2">
                {(user.data?.role.name === 'TEACHER' ||
                  user.data?.role.name === 'ADMIN') && (
                  <>
                    <StandardButton
                      className="bg-transparent! px-2 py-1"
                      title="Add student"
                      onClick={() => {
                        setStudentModalClassroomId(index);
                        setStudentModalOpen(true);
                      }}
                    >
                      <PlusIcon className="mr-1 size-6" />
                    </StandardButton>
                    <StandardButton
                      className="bg-transparent! px-2 py-1"
                      title="Bulk Create VM"
                      onClick={() => {
                        setVmModalOpen(true);
                      }}
                    >
                      <PackagePlus className="mr-1 size-6" />
                    </StandardButton>
                    <StandardButton
                      className="bg-transparent! px-2 py-1"
                      title="Delete Classroom"
                      onClick={() => {
                        setDeleteClassroomId(index);
                        setDeleteClassroomModalOpen(true);
                      }}
                    >
                      <Trash2Icon className="size-6" />
                    </StandardButton>
                  </>
                )}
              </div>
            </div>

            {isOpen && (
              <div className="p-4 transition-all duration-300">
                <StudentList classroomId={classroom.id} />
              </div>
            )}

            <AddStudentModal
              isOpen={isStudentModalOpen}
              classroomId={
                studentModalClassroomId !== null
                  ? classrooms[studentModalClassroomId]?.id
                  : undefined
              }
              onClose={() => {
                setStudentModalOpen(false);
                setStudentModalClassroomId(null);
              }}
            />

            <CreateVirtualMachineModal
              desc="Create machines for your whole classroom"
              isOpen={isCreateVirtualMachineModalOpen}
              onClose={() => setVmModalOpen(false)}
            />
            <DeleteClassroomModal
              isOpen={isDeleteClassroomModalOpen}
              onClose={() => setDeleteClassroomModalOpen(false)}
              onSubmit={() => {
                if (deleteClassroomId !== null) {
                  deleteClassroomMutation.mutate(classrooms[index].id);
                }
                setDeleteClassroomModalOpen(false);
                setDeleteClassroomId(null);
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

interface StudentListProps {
  classroomId?: number;
}

/** Student List for Classroom */
export function StudentList({ classroomId }: StudentListProps) {
  const [isDeleteStudentModalOpen, setDeleteStudentModalOpen] = useState(false);
  const [deleteStudentId, setDeleteStudentId] = useState<number | null>(null);

  const queryClient = useQueryClient();

  const students = useQuery({
    queryKey: ['students', classroomId],
    queryFn: () => getAllStudentsInClassroom(classroomId!),
  });

  const removeStudent = useMutation({
    mutationFn: (userId: number) => {
      return removeStudentFromClassroom(classroomId!, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  const user = useAuth();

  return (
    <ul className="space-y-2">
      {students.isLoading ? (
        <LoadingBounce></LoadingBounce>
      ) : students.data?.error ? (
        <div>No user found</div>
      ) : students.data?.length > 0 ? (
        students.data?.map((student: any) => (
          <li
            key={student.id}
            className="flex justify-between items-center bg-background mx-2 px-3 py-2 border-lightforeground border-b-1 last:border-b-0"
          >
            <div className="flex flex-row w-full">
              <div className="flex flex-row items-center w-fit">
                <Icon iconNode={[]} className="w-fit size-6">
                  <UserIcon />
                </Icon>
                <span className="ml-3">
                  {student.user.firstName} {student.user.lastName}
                </span>
              </div>
              <div className="flex flex-row justify-end items-center grow">
                {(user.data?.role.name === 'TEACHER' ||
                  user.data?.role.name === 'ADMIN') && (
                  <button
                    className="bg-background hover:bg-secondary ml-4 rounded-[8] w-fit size-8"
                    onClick={() => {
                      setDeleteStudentId(student.user.id);
                      setDeleteStudentModalOpen(true);
                    }}
                  >
                    <Trash2 className="size-6" />
                  </button>
                )}
              </div>
            </div>
          </li>
        ))
      ) : (
        <div>No students here</div>
      )}
      <DeleteStudentModal
        isOpen={isDeleteStudentModalOpen}
        onClose={() => setDeleteStudentModalOpen(false)}
        onSubmit={() => {
          setDeleteStudentModalOpen(false);
          removeStudent.mutate(deleteStudentId!);
          setDeleteStudentId(null);
        }}
      />
    </ul>
  );
}

interface ClassButtonProps {
  icon?: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
}

/** Class Button Component */
export function ClassButton({
  icon,
  label,
  onClick,
  className,
}: ClassButtonProps) {
  return (
    <button
      onClick={onClick}
      className={
        'flex items-center rounded-[8] p-2 bg-foreground' +
        (className ? ' ' + className : '')
      }
    >
      <span className="">{label}</span>
      {icon && <span className="mr-4">{icon}</span>}
    </button>
  );
}
