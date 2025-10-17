


import { ComputerIcon, Icon, Pause, Play } from "lucide-react";
import React, {useState} from "react";

interface VmComponentProps {
    assignedVMs?: {
        id: number;
        name: string;
        state: 'running' | 'stopped';
    }[];
}



export function VmComponent({ assignedVMs }: VmComponentProps) {

    const [state, setState] = React.useState<string[]>(assignedVMs?.map(vm => vm.state) ?? []);

    function toggleState(vmId: number) {
         assignedVMs?.map(vm =>{
            if (vm.id === vmId) {
                if (vm.state === 'stopped') {
                    setState((previousValue) => {
                        const newState = [...previousValue];
                        newState[vmId] = 'running';
                        return newState;
                    });
                }else if (vm.state === 'running') {
                    setState((previousValue) => {
                        const newState = [...previousValue];
                        newState[vmId] = 'stopped';
                        return newState;
                    });
                }
            }
         })
    }

    return (
       
           <ul className="flex flex-row w-full justify-end h-full space-x-3">
                {assignedVMs?.map(assignedVM => (
                    <li key={assignedVM.id}>

                        <div className="flex flex-row w-fit h-full items-center bg-foreground rounded-[8]">
                            <ComputerIcon className="w-6 h-6 m-1 ml-2" />
                            <span className="mx-2">{assignedVM.name}</span>
                            {assignedVM.state === 'stopped' ? (
                                <Play className="size-5 mr-2" onClick={() => (toggleState(assignedVM.id), console.log('Play clicked'))} />
                            ) : (
                                <Pause className="size-5 mr-2" onClick={() => (toggleState(assignedVM.id), console.log('Pause clicked'))} />
                            )}
                        </div>
                    </li>
                    
                ))}
           </ul>
       
    );
}



