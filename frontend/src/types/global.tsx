//global types for the app for consistency

declare global{
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
  type Theme = 'light' | 'dark'
}

export{};

