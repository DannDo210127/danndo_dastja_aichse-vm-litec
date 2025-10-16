'use client'
import { Codesandbox, LogIn, LogOut, Monitor, School, Settings, User as UserIcon } from "lucide-react";
import { Button } from "../shared/Button"
import { useRouter } from "next/navigation"
import { usePathname } from 'next/navigation'
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export function Navigation(){
    const router = useRouter();

    const pathname = usePathname();
    const slug = pathname.split('/')[2];

    const user = useAuth();

    return(
        <div className="flex flex-col w-1/3 h-full bg-background justify-between drop-shadow-2xl">

            <div className="flex flex-col gap-4 mx-5">
                <div className="border-b-2 border-b-gray-100 mx-2 my-4">
                    <Link href={"/"} className="flex flex-row items-center m-5">
                        <Codesandbox className="mr-2"/>
                        Virtual Classroom
                    </Link>
                </div>

                <Button slug={slug} label="Classroom" icon={<School />} onClick={() => router.push("/classroom")}></Button>
                <Button slug={slug} label="VM" icon={<Monitor />} onClick={() => router.push("/vm")}></Button>
            </div>
            
            {user.isAuthenticated ? (
                <div className="mx-5 mb-10">
                    <p className="border-b-2 border-b-gray-100 text-gray-200 mb-5 font-light">User Managment</p>
                    <div className="flex flex-col gap-4">
                        <Button slug={slug} label={user.data?.firstName + " " + user.data?.lastName} icon={<UserIcon />} onClick={() => router.push("/profile")}></Button>
                        <Button slug={slug} label="Settings" icon={<Settings />}></Button>
                        <Button slug={slug} label="Logout" icon={<LogOut />} onClick={() => user.logout()}></Button>
                    </div>  
                </div>
            ): (
                <div className="flex flex-col mx-5 gap-4 mb-10">
                    <Button slug={slug} label="Login" icon={<LogIn />} onClick={() => router.push("/login")}></Button>
                    <Button slug={slug} label="Register" icon={<LogOut />} onClick={() => router.push("/register")}></Button>
                </div>  
            )}
        </div>
    )
    
}