import api from "./client";


const getUser = async () => {
    const response = await api.get("/user")
  return response.data;
}

const logout = async () => {
    const response = await api.post("/auth/logout", { }, { withCredentials: true });
    return response.data;
}

const getUserRole = async () => {
    const response = await api.get("/user/role", { withCredentials: true });
    return response.data;
}

const findUserByName = async (searchQuery: string) => {
    const response = await api.get(`/user/find?query=${encodeURIComponent(searchQuery)}`);
    return response.data;
}

export const login = async (email: string, password: string) => {
    const response = await api.post("/auth/login", {
        email,
        password
    }, { withCredentials: true });

    return response.data;
}

export const register = async (firstName: string, lastName: string, email: string, password: string) => {
    const response = await api.post("/auth/register", {
        firstName,
        lastName,
        email,
        password
    }, { withCredentials: true });

    return response.data;
}

const User = {
    getUser,
    getUserRole,
    findUserByName,
    logout,
}



export default User;
