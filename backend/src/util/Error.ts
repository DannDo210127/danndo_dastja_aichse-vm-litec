interface VirtualClassroomError {
    error: {
        code: number;
        message: string;
    }
}

export const errorMessage = (code: number, message: string) => {
    return {
        error: {
            code: code,
            message: message, 
        }
    } as VirtualClassroomError;
}