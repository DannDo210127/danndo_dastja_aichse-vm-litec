'use client'
import api from "@/api/client";
import { Button } from "@/shared/Button";
import { useAuthStore } from "@/store/token-store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function LoginPage() {
  const authStore = useAuthStore() 
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // dominik.danner@test.org
  // test
  const loginUser = useMutation({
    mutationFn: async () => {
      const { data } = await api.post("/auth/login", {
        email,
        password
      });

      authStore.setTokens(data.accessToken)
    },

    onSuccess: (data) => {
      console.log("Login successful", data);
      router.push("/");
    }
  });

  return (
    <div>
      <input type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={() => loginUser.mutate()}>Login</button>
    </div>
    
  );
}
