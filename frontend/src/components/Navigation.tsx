'use client'
import { Codesandbox, Home, LogOut, Monitor, School, User } from "lucide-react";
import { NavigationButton } from "../components/NavigationButton"
import { useRouter } from "next/navigation"
import { usePathname } from 'next/navigation'
import Link from "next/link";

export function Navigation(){
    const router = useRouter();

    const pathname = usePathname();
    const slug = pathname.split('/')[2];

    return(
        <div className="flex flex-col w-1/5 h-full bg-background justify-between drop-shadow-2xl">

            <div className="flex flex-col gap-4 mx-5">
                <div className="border-b-2 border-b-gray-100 my-3">
                    <Link href={"/"} className="flex flex-row items-center m-5">
                        <Codesandbox className="mr-2"/>
                        Virtual Classroom
                    </Link>
                </div>

                <NavigationButton label="Classroom" icon={<School />} href="/classrooms"></NavigationButton>
                <NavigationButton label="VM" icon={<Monitor />} href="/vm"></NavigationButton>
            </div>
            
            <div className="flex flex-col mx-5 gap-4 mb-10">
                <NavigationButton label="Profile" icon={<User />} href="/profile"></NavigationButton>
                <NavigationButton label="Logout" icon={<LogOut />} href=""></NavigationButton>
            </div>  
        </div>
    )
    
}