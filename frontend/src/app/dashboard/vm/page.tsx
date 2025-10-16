'use client'
import { Navigation } from "@/components/Navigation"

export default function VMPage(){
     return (
            <div className="flex flex-row w-screen h-screen">
                <Navigation/>
                <div className="flex flex-col w-fit h-full bg-background"></div>
            </div>
        )
}