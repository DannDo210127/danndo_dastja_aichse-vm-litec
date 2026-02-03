// useAuth.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import User from "@/api/user";
import { useEffect } from "react";
import { useAuthStore } from "@/store/token-store";

export function useAuth() {
    const tokenStore = useAuthStore((state) => state);
    const queryClient = useQueryClient();

    const { mutate: logout } = useMutation({
        mutationFn: () => User.logout(),
        onSuccess: () => {
            tokenStore.clearTokens();
            queryClient.invalidateQueries();
            document.location.reload();
        },
    });

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["user"],
        queryFn: () => User.getUser(),
        retry: false,
    });

    useEffect(() => {
        refetch();
    }, [tokenStore.accessToken, refetch]);

    const isAuthenticated = data ? true : false;

    return { data, isLoading, isError, refetch, isAuthenticated, logout };
}
