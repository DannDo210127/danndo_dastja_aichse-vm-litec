"use client";
import { BookOpen, MonitorPlay, Settings, Users } from "lucide-react";
import Link from "next/link";

export default function IndexPage() {
    return (
        <div className="flex flex-col m-20 w-8/10 h-8/10 rounded-[8] bg-background">
            <div className="flex flex-row justify-between w-full h-1/12 bg-background border-b-2 border-lightforeground items-center">
                <h2 className="m-5 p-2 text-2xl font-bold">
                    Welcome to Virtual Classroom
                </h2>
            </div>
            <div className="flex flex-col m-4 p-4 bg-background overflow-auto">
                <p className="text-font opacity-70 mb-6">
                    Manage your classrooms, virtual machines, and learning
                    environment
                </p>
            </div>
        </div>
    );
}
