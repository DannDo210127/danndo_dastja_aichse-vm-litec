'use client'
import { Button } from "./Button"
import { useRouter } from "next/navigation"
import { usePathname } from 'next/navigation'
import '@/app/styles/globals.css'

export function Navigation(){

    const router = useRouter();

    const pathname = usePathname();
    const slug = pathname.split('/')[2];
    console.log("slug in nav", slug);

    return(
        <div className="flex flex-col w-3/8 md:w-3/8 lg:w-3/8 xl:w-2/8 h-100vh bg-foreground items-left justify-left rounded-xl m-10 ml-0 rounded-l-none p-4">
           <Button className="h-15 text-start text-3xl sm:text-5xl" onClick={() => router.push(`/home/${slug}`)}>Home</Button>

           {slug === 'teachers' && (
                <>
                    <Button className="h-15 mt-18 text-center w-fit text-1xl sm:text-3xl" onClick={() => router.push(`/home/${slug}/dashboard`)}>Dashboard</Button>
                    <Button className="h-15 mt-8 text-center w-fit text-1xl sm:text-3xl">VM</Button>
                </>
           )}{slug === 'students' && (
                <Button className="h-15 mt-18 text-center w-fit text-1xl sm:text-3xl" onClick={() => router.push(`/home/${slug}/vm`)} >VM</Button>
           )}
           

           <div className="flex justify-end items-end h-full">
            <Button className="h-15 mb-0 text-center w-fit text-1xl sm:text-2xl" onClick={ () => router.push('/') }>LogOut</Button>
           </div>
        </div>
    )
    
}