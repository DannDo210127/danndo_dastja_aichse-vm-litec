'use client'
import api from "@/api/client";
import { Button } from "@/shared/Button";
import { useAuthStore } from "@/store/token-store";
import { useQuery } from "@tanstack/react-query";
import { use, useEffect } from "react";

export default function LoginPage() {
  const authStore = useAuthStore() 
  
  const data = useQuery({
    queryKey: ["login"],
    queryFn: async () => {
      const { data } = await api.post("/auth/login", {
        email: "dominik.danner@test.org",
        password: "test"
      });

      authStore.setTokens(data.accessToken, data.refreshToken)
    },
  });

  const user = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await api.get("/user");
      return data;
    },
    enabled: !!authStore.accessToken // only run if accessToken is set
  });

  return (
    <div>login page</div>
    
  );
}
