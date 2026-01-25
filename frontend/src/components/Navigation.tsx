'use client'
import React, { Fragment, useState } from "react";
import { Codesandbox, LogIn, LogOut, Monitor, School, UserCog } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ConfirmModal } from "@/shared/ConfirmModal";
import { LoginModal } from "./LoginModal";
import { NavigationButton } from "./NavigationButton";
import { RegisterModal } from "./RegisterModal";
import { LoadingScreen } from "@/shared/LoadingScreen";
import { useThemeStore } from "@/store/theme-store";

export function Navigation(){
    const user = useAuth();

    const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);

    return(
        user.isLoading ? <LoadingScreen /> :
        <Fragment>
        
                <div className={`w-25.5 hover:lg:w-1/5 hover:md:w-1/4 hover:w-1/3 ${useThemeStore.getState().theme == 'light' ? "border-r-4 border-lightforeground" : ""} drop-shadow-lg ease-in-out transition-[width] duration-350 flex flex-col justify-between bg-background  h-full`}>
                    <div className={`flex flex-col gap-4 mx-5`}>  
                    
                        <NavigationButton className="!bg-background hover:!bg-background my-5 border-b-2 border-b-foreground !rounded-none" label="Virtual Classroom" icon={<Codesandbox />} href="/" />

                        <NavigationButton label="Classrooms" icon={<School />} href="/classrooms"/>
                        <NavigationButton label="VM" icon={<Monitor />} href="/vm" />
                    </div>
                    
                    {user.isAuthenticated ? (
                        <div className="mx-5 mb-5">
                            <p className="mb-5 border-b-2 border-b-foreground"/>
                            <div className="flex flex-col gap-4">
                                <NavigationButton
                                label={user.data?.firstName + " " + user.data?.lastName}
                                icon={<UserCog/>}
                                href="/profile"
                                />  
                                <NavigationButton className="text-error" label="Logout Account" icon={<LogOut />} onClick={() => setLogoutModalOpen(true)} />
                            </div>
                        </div>
                    ): (
                        <div className="flex flex-col gap-4 mx-5 mb-10">
                            <NavigationButton label="Login" icon={<LogIn />} onClick={() => setLoginModalOpen(true)} />
                            <NavigationButton label="Register" icon={<LogOut  />} onClick={() => setRegisterModalOpen(true)} />
                        </div>
                    )}
                
                </div>
          

            <RegisterModal isOpen={isRegisterModalOpen} onClose={() => setRegisterModalOpen(false)} onSubmit={() => setRegisterModalOpen(false)} />
            <LoginModal isOpen={isLoginModalOpen} onClose={() => setLoginModalOpen(false)} onSubmit={() => setLoginModalOpen(false)} />

            <ConfirmModal title="Confirm Logout" description="Are you sure you want to logout?" isOpen={isLogoutModalOpen} onClose={() => {
                setLogoutModalOpen(false);
            }} onConfirm={() => {
                user.logout();
                setLogoutModalOpen(false);
            }}/>
        </Fragment>
    )
}