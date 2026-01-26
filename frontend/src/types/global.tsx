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

  // Virtual Machine type, just an example, not the real database model
  interface VM{
    id:number;
    name:string;
    state: 'NotRunning' | 'Running' | 'Idle' | 'Starting' | 'Stopping';
    image:string;
    ipAddress?:string;
    userId:number;
  }
}

export{};

