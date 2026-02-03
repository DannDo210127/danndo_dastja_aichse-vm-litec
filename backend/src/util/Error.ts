interface VirtualClassroomError {
    error: {
        code: number;
        message: string;
        silent?: boolean;
    }
}

export const errorMessage = (code: number, message: string, silent: boolean = false) => {
    return {
        error: {
            code: code,
            message: message,
            silent: silent
        }
    } as VirtualClassroomError;
}