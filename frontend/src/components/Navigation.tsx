'use client'
import { Codesandbox, LogIn, LogOut, Monitor, School, UserCog } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Fragment, useEffect, useState } from "react";
import { ConfirmModal } from "@/shared/ConfirmModal";
import { LoginModal } from "./LoginModal";
import { NavigationButton } from "./NavigationButton";
import { RegisterModal } from "./RegisterModal";
import { LoadingScreen } from "@/shared/LoadingScreen";

export function Navigation(){
    const user = useAuth();

    const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);

    return(
        user.isLoading ? <LoadingScreen /> :
        <Fragment>
            
            <div className="flex flex-col w-1/3 h-full bg-background justify-between drop-shadow-2xl">

                <div className="flex flex-col gap-4 mx-5">
                    <div className="border-b-2 border-b-lightforeground mx-2 my-4">
                        <Link href={"/"} className="flex flex-row items-center m-5">
                            <Codesandbox className="mr-2"/>
                            Virtual Classroom
                        </Link>
                    </div>

                    <NavigationButton label="Classrooms" icon={<School />} href="/classrooms" />
                    <NavigationButton label="VM" icon={<Monitor />} href="/vm" />
                </div>
                {user.isAuthenticated ? (
                    <div className="mx-5 mb-10">
                        <p className="border-b-2 border-b-lightforeground mb-5"></p>
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
                    <div className="flex flex-col mx-5 gap-4 mb-10">
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