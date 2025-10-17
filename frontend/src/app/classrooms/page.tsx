'use client'
import { Classroom } from "@/components/Classroom"
import { Navigation } from "@/components/Navigation"
import { Button } from "@/shared/Button"
import { Plus } from "lucide-react"

export default function ClassroomPage(){
    return (
           <div className="flex flex-col w-full h-screen">
               <div className="flex flex-row w-full h-1/6 bg-background">
                    <Button icon={<Plus className="size-6" />} label="Create Classroom" onclick={() => {}} className="m-12 mb-3 ml-40 self-end"/>
               </div>
               <Classroom/>
           </div>
       )
}