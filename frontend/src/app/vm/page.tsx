'use client'

import { StandardButton } from "@/shared/StandardButton";
import { CirclePowerIcon, ComputerIcon, PlusIcon,  ScreenShareIcon, Trash2Icon } from "lucide-react";

interface VmComponent{
        id: number;
        name: string;
        state: 'running' | 'stopped';
    
}

const assignedVms: VmComponent[] = [
    { id: 1, name: "Debian 13", state: "running" },
    { id: 2, name: "Ubuntu 22.04", state: "stopped" },
]

export default function VMPage(){
     return (
            <div className="flex flex-col m-20 w-8/10 h-8/10 rounded-[8] bg-background">
                <div className="flex flex-row justify-between items-center border-b-2 border-foreground">
                    <h2 className="m-5 p-2 text-2xl font-bold">Your Virtual Machines</h2>
                    <StandardButton label="Create Virtual Machine" onClick={() => {}}>
                        <PlusIcon className="size-6 mr-1" />
                    </StandardButton>
                </div>
               
                <VmComponent assignedVms={assignedVms}></VmComponent>
            </div>
        )
}

interface VmComponentProps{
    assignedVms: VmComponent[];
}

export function VmComponent(props: VmComponentProps){
    return (
        <div className="flex flex-col m-5 p-2 rounded-[8]">
            <ul>
                {props.assignedVms.map((vm) => (
                    <li key={vm.id} className="mb-4 p-2 bg-foreground rounded-[8]">
                        <div className="flex flex-row h-full w-full ">
                            <div className="flex flex-row flex-grow">
                                <ComputerIcon className="w-6 h-6  ml-1 self-center"/>
                                <span className="ml-4 text-lg w-5/10 h-fit self-center">{vm.name}</span>
                            </div>
                            <StandardButton label="connect" className="" onClick={() => {}} >
                                <ScreenShareIcon className="size-5 mr-1" />
                            </StandardButton>
                            <StandardButton label={vm.state === 'running' ? 'Stop' : 'Start'} className="ml-1" onClick={() => {}} >
                                <CirclePowerIcon className="size-5 mr-1" />
                            </StandardButton>
                            <Trash2Icon className="w-7 h-10 p-0.5 ml-1 self-center rounded-[8] hover:bg-secondary cursor-pointer" />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}