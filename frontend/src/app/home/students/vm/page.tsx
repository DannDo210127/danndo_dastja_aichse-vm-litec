'use client';
import { Navigation } from "@/components/Navigation";
import VncViewer from "@/components/VncViewer";

export default function VmPage() {


    return (

        <div className="flex flex-row w-screen h-screen bg-background ">
            <Navigation />
            <div className="w-full h-100vh bg-foreground m-20 p-4 rounded-2xl rounded-r-none mr-0">

               <VncViewer password="debian"/>
            </div> 
        </div>
    );
}