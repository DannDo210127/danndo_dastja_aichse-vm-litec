'use client'
import { useAuth } from "@/hooks/useAuth";
import User from "@/api/user";
import { useQuery } from "@tanstack/react-query";

export default function ProfilePage(){
    const user = useAuth();

    const userRole = useQuery({
        queryKey: ['userRole'],
        queryFn: () => User.getUserRole(),
        enabled: user.isAuthenticated,
    });


    
    return (
        

         <div className="flex flex-col m-20 w-8/10 h-8/10 rounded-[8] bg-background">
            <div className="flex flex-row justify-between items-center border-b-2 border-lightforeground">
                <h2 className="m-5 p-2 text-2xl font-bold">{user.data?.firstName + " " + user.data?.lastName}</h2>  
                <span className="font-bold text-gray-500"> {userRole.data?.name}</span>              
            </div>
            <div>{user.data?.role}</div>
            <div className="p-4 m-4 flex flex-col justify-between">
                <div className="flex flex-row">
                    <span className="flex-grow font-2xl">Email:
                    </span> {user.data?.email}
                </div>
                <div className="flex flex-row mt-7">
                    <span className="flex-grow font-2xl">placeholder:
                    </span> {}
                </div>
            </div>
        </div>
    )
}