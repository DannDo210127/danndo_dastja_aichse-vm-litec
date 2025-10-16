'use client'
import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage(){
    const user = useAuth();


    return (
        <div className="flex flex-row">
            <div className="flex flex-col w-fit h-full bg-background">
                <div>EMAIL: {user.data?.email}</div>
    
                <div>USERNAME: {user.data?.firstName} {user.data?.lastName}</div>
                <div>ROLE: {user.data?.roleId}</div>
            </div>
        </div>
    )
}