import api from "./client";

const createClassroom = async (name: string, description: string) => {
    const response = await api.post(
        "/classroom/new",
        {
            name,
            description,
        },
        { withCredentials: true },
    );
    return response.data;
};

const deleteClassroom = async (classroomId: number) => {
    const response = await api.delete(`/classroom/delete/${classroomId}`, {
        withCredentials: true,
    });
    return response.data;
};

const getAllClassrooms = async () => {
    const response = await api.get("/classroom/", { withCredentials: true });
    return response.data;
};

const getAllStudentsInClassroom = async (classroomId: number) => {
    const response = await api.get(`/classroom/${classroomId}/students`, {
        withCredentials: true,
    });
    return response.data;
};

const removeStudentFromClassroom = async (
    classroomId: number,
    userId: number,
) => {
    const response = await api.delete(`/classroom/${classroomId}/${userId}`, {
        withCredentials: true,
    });
    return response.data;
};

const addStudentToClassroom = async (classroomId: number, userId: number) => {
    const response = await api.post(
        `/classroom/${classroomId}/add`,
        { userId },
        { withCredentials: true },
    );
    return response.data;
    //TODO: implememnt feature when backend search function is ready
};

export {
    createClassroom,
    deleteClassroom,
    getAllClassrooms,
    getAllStudentsInClassroom,
    addStudentToClassroom,
    removeStudentFromClassroom,
};
