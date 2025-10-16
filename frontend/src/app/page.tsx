'use client'
import api from "@/api/client";
import { useAuthStore } from "@/store/token-store";

import { useMutation, useQuery } from "@tanstack/react-query";

const IndexPage = () => {
  const user = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await api.get("/user");
      return data;
    },
  });

  const logout = useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout", {}, { withCredentials: true });
    },

    onSuccess: () => {
      useAuthStore.getState().clearTokens();
    }
  })



  return (
    <div>
      <div>{user.data?.email}</div>
    
      <div>{user.data?.firstName} {user.data?.lastName}</div>
      
      <button onClick={() => logout.mutate()}>Logout</button>

      INDEX
    </div>
  )
};

export default IndexPage;