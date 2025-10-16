'use client'
import { Button } from "../shared/Button"
import { useRouter } from "next/navigation"
import { usePathname } from 'next/navigation'

export function Navigation(){
    const router = useRouter();

    const pathname = usePathname();
    const slug = pathname.split('/')[2];

    return(
        <div>Navigation</div>
    )
    
}