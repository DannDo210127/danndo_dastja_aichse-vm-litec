'use client'
import React, { Fragment, useEffect, useState } from "react";
import { Codesandbox, LogIn, LogOut, Monitor, School, UserCog } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { ConfirmModal } from "@/shared/ConfirmModal";
import { LoginModal } from "./LoginModal";
import { NavigationButton } from "./NavigationButton";
import { RegisterModal } from "./RegisterModal";
import { LoadingScreen } from "@/shared/LoadingScreen";
import clsx from "clsx";

export function Navigation(){
    const user = useAuth();

    const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    return(
        user.isLoading ? <LoadingScreen /> :
        <Fragment>

            <div className={`${isCollapsed ? "w-25 " : "w-1/3"} ease-in-out transition-[width] duration-500 flex flex-col justify-between bg-background drop-shadow-2xl h-full`}>
            <button className="top-2/3 -right-6.5 z-[60] fixed bg-secondary rounded-full w-13 h-13"
                onClick={()=>{setIsCollapsed(!isCollapsed)}} >
                    <div className={`bottom-1.1 left-1/2 -translate-x-1/2 relative bg-background rounded-[8] w-5 h-2 rotate-45 transition-transform duration-200 ${isCollapsed ? "rotate-135 " : ""}`}></div>
                    <div className={`top-1.1 left-1/2 -translate-x-1/2 relative bg-background rounded-[8] w-5 h-2 rotate-135 transition-transform duration-200 ${isCollapsed ? "rotate-230 " : ""}`}></div>
            </button>
            

                <div className={`flex flex-col gap-4 mx-5`}>
                 
                    <NavigationButton className="!bg-background hover:!bg-background my-4 mt-6 border-b-2 border-b-lightforeground !rounded-none" label="Virtual Classroom" icon={<Codesandbox />} href="/" />

                    <NavigationButton label="Classrooms" icon={<School />} href="/classrooms"/>
                    <NavigationButton label="VM" icon={<Monitor />} href="/vm" />
                  
                </div>
                {user.isAuthenticated ? (
                    <div className="mx-5 mb-10">
                        <p className="mb-5 border-b-2 border-b-lightforeground"></p>
                        <div className="flex flex-col gap-4">
                            <NavigationButton
                              label={user.data?.firstName + " " + user.data?.lastName}
                              icon={<UserCog/>}
                              href="/profile"
                            />
                            <NavigationButton label="Logout" icon={<LogOut />} onClick={() => setLogoutModalOpen(true)} />
                        </div>
                    </div>
                ): (
                    <div className="flex flex-col gap-4 mx-5 mb-10">
                        <NavigationButton label="Login" icon={<LogIn />} onClick={() => setLoginModalOpen(true)} />
                        <NavigationButton label="Register" icon={<LogOut />} onClick={() => setRegisterModalOpen(true)} />
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