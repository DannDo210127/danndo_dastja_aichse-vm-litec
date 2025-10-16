// useAuth.js
import { useMutation, useQuery } from '@tanstack/react-query'
import User from '@/api/user'
import { useEffect } from 'react'
import { useAuthStore } from '@/store/token-store'
import api from '@/api/client';

export function useAuth() {
    const tokenStore = useAuthStore((state) => state);

    const { mutate: logout } = useMutation({
        mutationFn: () => User.logout(),
        onSuccess: () => {
            tokenStore.clearTokens()
            window.location.reload();
        }
      });

    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ['user'],
        queryFn: () => User.getUser(),
        retry: false,
    })

    useEffect(() => {
        refetch()
    }, [tokenStore.accessToken, refetch])

    const isAuthenticated = !!data;

    return { data, isLoading, isError, refetch, isAuthenticated, logout }
}
