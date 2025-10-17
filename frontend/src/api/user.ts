import api from "./client";


const getUser = async () => {
    const response = await api.get("/user")
  return response.data;
}

const logout = async () => {
    const response = await api.post("/auth/logout", { }, { withCredentials: true });
    return response.data;
}

const User = {
    getUser,
    logout
}

export default User;
