'use client'
import { Codesandbox, Home, LogOut, Monitor, School, User } from "lucide-react";
import { Button } from "../shared/Button"
import { useRouter } from "next/navigation"
import { usePathname } from 'next/navigation'

export function Navigation(){
    const router = useRouter();

    const pathname = usePathname();
    const slug = pathname.split('/')[2];

    return(
        <div className="flex flex-col w-1/8 h-full bg-background justify-between">

            <div className="flex flex-col">
                <Button slug={slug} className="m-2 mr-5" label="Virtual Classroom" icon={<Codesandbox />} onClick={() => router.push("/dashboard")}></Button>
                <Button slug={slug} className="m-5" label="Classroom" icon={<School />} onClick={() => router.push("/dashboard/classroom")}></Button>
                <Button slug={slug} className="m-5" label="VM" icon={<Monitor />} onClick={() => router.push("/dashboard/vm")}></Button>
            </div>
            
            <div className="flex flex-col">
                <Button slug={slug} className="m-5" label="Profile" icon={<User />} onClick={() => router.push("/dashboard/profile")}></Button>
                <Button slug={slug} className="m-5" label="Logout" icon={<LogOut />} ></Button>
            </div>  
        </div>
    )
    
}