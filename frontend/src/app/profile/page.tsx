'use client'
import { useAuth } from "@/hooks/useAuth";
import User from "@/api/user";
import { useQuery } from "@tanstack/react-query";
import { useThemeStore } from "@/store/theme-store";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import * as React from "react";

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
                
                
            </div>
            <SettingsPage />
        </div>
    )
}

function SettingsPage() {

    const [isDarkMode, setDarkMode] = React.useState<boolean>(false); // Initialize with false
    const themeStore = useThemeStore();

  

    return (
            <div className="">
               <div className="flex flex-row justify-between w-full h-1/12 bg-background border-b-2 border-lightforeground items-center">
                    <h2 className="m-5 p-2 text-2xl font-bold">Your Settings</h2>
                </div>
                <div className="flex flex-col m-4 p-4 bg-background gap-10">
                    <div className="flex items-center">
                        <span className="text-lg flex-grow">light/darkmode</span>
                        <DarkModeSwitch
                          checked={themeStore.theme === "dark"}
                          onChange={themeStore.toggleTheme}
                          size={40}
                          sunColor="#FDB813"
                          moonColor="#F4F4F5"
                        />
                    </div>
                </div>
            </div>
    );
}