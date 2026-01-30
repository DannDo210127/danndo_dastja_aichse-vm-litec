'use client'
import { useAuth } from "@/hooks/useAuth";
import { useThemeStore } from "@/store/theme-store";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { StandardButton } from "@/shared/StandardButton";
import { useEffect, useState } from "react";
import { DeveloperModal } from "@/components/DeveloperModal";

export default function ProfilePage(){

    return (
         <div className="flex flex-col bg-background m-20 mx-25 rounded-[8] h-8/10 grow">
            <UserSettingsPage/>
            <SettingsPage/>
        </div>
    )
}

function UserSettingsPage() {
    const user = useAuth();

    return (
        <div>
            <div className="flex flex-row justify-between items-center border-lightforeground border-b-2">
                <h2 className="m-5 p-2 font-bold text-3xl">{user.data?.firstName + " " + user.data?.lastName}</h2>  
                <span className="font-bold text-gray-500"> {user.data?.role.name}</span>              
            </div>
            <div className="flex flex-col justify-between m-4 mb-10 p-4">
                <div className="flex flex-row">
                    <span className="flex-grow font-2xl">Email:
                    </span> {user.data?.email}
                </div>
            </div>
        </div>
    )
}

function SettingsPage() {
    const themeStore = useThemeStore();
    const [isDeveloperModalOpen, setDeveloperModalOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
            <div>
               <div className="flex flex-row justify-between items-center bg-background border-lightforeground border-b-2 w-full h-1/12">
                    <h4 className="m-5 p-2 font-bold text-2xl">Your Settings</h4>
                </div>
                <div className="flex flex-col gap-10 bg-background m-4 p-4">
                    <div className="flex items-center">
                        <span className="flex-grow text-lg">light/darkmode</span>
                        {mounted && (
                        <DarkModeSwitch
                          checked={themeStore.theme === "dark"}
                          onChange={themeStore.toggleTheme}
                          size={40}
                          sunColor="#FDB813"
                          moonColor="#F4F4F5"
                        />
                        )}
                    </div>
                    <div className="w-56">

                        <StandardButton label="Developer Modal" onClick={() => setDeveloperModalOpen(true)} className="bg-lightforeground m-4 px-6 py-3" />
                    </div>
                </div>


                <DeveloperModal isOpen={isDeveloperModalOpen} onClose={() => setDeveloperModalOpen(false)} />
            </div>
    );
}