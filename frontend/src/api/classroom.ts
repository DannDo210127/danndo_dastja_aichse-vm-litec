import api from "./client";

const getAllClassrooms = async () => {
    const response = await api.get("/classroom/", { withCredentials: true });
    return response.data;
}

const getAllStudentsInClassroom = async (classroomId: number) => {
    const response = await api.get(`/classroom/${classroomId}/students`, { withCredentials: true });
    return response.data;
}

const removeStudentFromClassroom = async (classroomId: number, userId: number) => {
    const response = await api.delete(`/classroom/${classroomId}/`, {
        data: { userId },
        withCredentials: true,
    });
    return response.data;
}

export { getAllClassrooms, getAllStudentsInClassroom, removeStudentFromClassroom }; 