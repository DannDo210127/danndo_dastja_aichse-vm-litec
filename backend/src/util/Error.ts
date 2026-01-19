interface VirtualClassroomError {
    code: number;
    message: string;
}

export const errorMessage = (code: number, message: string) => {
    return {
        code: code,
        message: message, 
    } as VirtualClassroomError;
}