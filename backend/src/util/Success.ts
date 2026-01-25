interface VirtualClassroomSuccess {
    success: {
        code: number;
        message: string;
        silent?: boolean;
    }
}

export const successMessage = (code: number, message: string, silent: boolean = false) => {
    return {
        success: {
            code: code,
            message: message,
            silent: silent
        }
    } as VirtualClassroomSuccess;
}