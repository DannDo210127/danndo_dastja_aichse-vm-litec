'use client'

import { StandardButton } from "@/shared/StandardButton";
import { CirclePowerIcon, ComputerIcon, PlusIcon,  ScreenShareIcon, Trash2Icon } from "lucide-react";
import { FC, useEffect, useReducer, useState } from "react";
import StandardModal  from "@/shared/StandardModal";
import { StandardInput } from "@/shared/StandardInput";
import {Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ImageResponse } from "next/server";
import { ConfirmModal } from "@/shared/ConfirmModal";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LoginModal } from "@/components/LoginModal";

interface VmComponent{
        id: number;
        name: string;
        image?: string;
        state: 'running' | 'stopped';
        ipPath?: string;
    
}

const assignedVms: VmComponent[] = [
    { id: 1, name: "Debian 13",image:"debian13.netinst", state: "running", ipPath: "127.0.0.1:9090" },
    { id: 2, name: "Ubuntu 22.04",image:"ubuntu2204.netinst", state: "stopped", ipPath: "127.0.0.1:9091" },
    { id: 3, name: "CentOS 8", image:"centos8.netinst", state: "running", ipPath: "127.0.0.1:9092" },
    { id: 4, name: "Fedora 36", image:"fedora36.netinst", state: "stopped", ipPath: "127.0.0.1:9093" },
]


 interface image{
        id: number;
        name: string;
        image?: string;
    }

    const images: image[] = [
        { id: 1, name: "Debian 13",image:"debian13.netinst" },
        { id: 2, name: "Ubuntu 22.04",image:"ubuntu2204.netinst" },
        { id: 3, name: "CentOS 8", image:"centos8.netinst" },
        { id: 4, name: "Fedora 36", image:"fedora36.netinst" },
    ]


export default function VMPage(){

    const [isVmModalOpen, setVmModalOpen] = useState(false);

    const [vmErrorMessage, setVmErrorMessage] = useState<string>("");

    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const user = useAuth();

    useEffect(() => {
      if (!user.isAuthenticated) {
        setLoginModalOpen(true);
      }}, [user.isAuthenticated]);

    return (
        !user.isAuthenticated ? <LoginModal isOpen={isLoginModalOpen} onClose={() => setLoginModalOpen(false)} onSubmit={() => setLoginModalOpen(false)} /> :
            <div className="flex flex-col bg-background m-20 mx-30 rounded-[8] h-8/10 grow">
                <div className="flex flex-row justify-between items-center border-lightforeground border-b-2">
                    <h2 className="m-5 p-2 font-bold text-2xl">Your Virtual Machines</h2>
                    <StandardButton className="bg-lightforeground hover:bg-contrast! drop-shadow-sm p-2.5! hover:text-background hover:scale-105 transition-all" label="Create VM" onClick={() => {setVmModalOpen(true);}} >
                        <PlusIcon className="mr-1 size-6" />
                    </StandardButton>
                </div>
               
                <VmComponent assignedVms={assignedVms}></VmComponent>
                <CreateVmModal errormessage={vmErrorMessage} images={images} isOpen={isVmModalOpen} onClose={() => setVmModalOpen(false)} onSubmit={(Vmname, selectedImage) => {
                    if(assignedVms.find(vm => vm.name.toLowerCase() === Vmname.toLowerCase())){
                        setVmErrorMessage("A VM with this name already exists.");
                        setVmModalOpen(true);
                        return;
                    }else{
                        setVmErrorMessage("");
                    }
                    assignedVms.push({
                        id: assignedVms.length===0 ? 1:(assignedVms[assignedVms.length - 1].id + 1),
                        name: Vmname,
                        image: selectedImage,
                        state: 'stopped',
                    });
                    console.log("Creating VM:", assignedVms.length, Vmname, selectedImage);
                    setVmModalOpen(false);
                }} />
            </div>
        )
}


interface CreateVmModalProps{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (VmName: string, image: string) => void;
    images: image[]
    errormessage?: string;
}

export const CreateVmModal: FC<CreateVmModalProps> = ({ isOpen, onClose, onSubmit, images, errormessage }) => {

    const [VmName, setVmName] = useState<string>("");
    const [selectedImage, setSelectedImage] = useState<image>();
    const [showError, setShowError] = useState<boolean>(false);

    const isCreateDisabled = !VmName.trim() || !selectedImage;

    useEffect(() => {
        if (!isOpen) {
            setSelectedImage(undefined);
            setVmName("");
            setShowError(false);
        }
    }, [isOpen]);



    
    // Show error when errormessage changes and is not empty
    useEffect(() => {
        if (errormessage) {
            setShowError(true);
        }
        }, [errormessage]);
    
    const handleSubmit = () => {
        setShowError(true); // Trigger animation when clicking Create
        onSubmit(VmName, selectedImage?.image || "");
    };
    

    return (
         <StandardModal className="w-96" title={"Create new Vm"} description={""} isOpen={isOpen}>
            <div className="flex flex-col space-y-4 mt-4">
                <StandardInput placeholder="VM name"  onValueChange={(value: string) => setVmName(value)} />
                
                <div>
                    {/* VM Type Selection Menu */}
                    <Menu>
                        <MenuButton className="bg-lightforeground px-4 py-2 rounded-[8] w-full text-left">
                            {selectedImage ? selectedImage.name : "Select VM Type"}
                        </MenuButton>
                        <MenuItems className="z-50 absolute bg-lightforeground drop-shadow-md mt-2 border border-lightforeground rounded-[8] w-fit">
                            {images.map((image) => (
                                <MenuItem key={image.id}>
                                    {({ active }) => (
                                        <button
                                            type="button"
                                            onClick={() => setSelectedImage(image)}
                                            className={`w-full text-left px-4 py-2 rounded-[6] focus:outline-none ${active ? 'bg-lightforeground' : ''}`}
                                        >
                                            {image.name}
                                        </button>
                                    )}
                                </MenuItem>
                            ))}
                        </MenuItems>
                    </Menu>
                    
                </div>
                <div 
                    className={`
                        overflow-hidden transition-all duration-300 ease-in-out
                        ${showError && errormessage ? 'max-h-20 opacity-100 py-2 px-4' : 'max-h-0 opacity-0'}
                        bg-red-400 rounded-[8] text-font text-sm 
                    `}
                >
                    {errormessage}
                </div>             

                <div className="flex justify-between mt-2 w-full">
                <div className="flex gap-4">
                    <StandardButton label="Cancel" onClick={onClose} className="bg-lightforeground px-6 py-3" />
                    <StandardButton label="Create" onClick={() => onSubmit(VmName, selectedImage?.image || "")} className={"ml-1 h-full px-10 py-3 bg-lightforeground "+(isCreateDisabled ? "" : "bg-contrast! text-background")} disabled={isCreateDisabled} />
                </div>

                </div>
            </div>
        </StandardModal>
    )
}





interface VmComponentProps{
    assignedVms: VmComponent[];
}

export function VmComponent(props: VmComponentProps){

    const [isDeleteVmModalOpen, setDeleteVmModalOpen] = useState(false);
    const [vmModalId, setVmModalId] = useState<number | null>(null);

    const [vmStates, setVmStates] = useState<Record<number, 'running' | 'stopped'>>(() =>
        Object.fromEntries(props.assignedVms.map(v => [v.id, v.state])) as Record<number, 'running' | 'stopped'>
    );

    useEffect(() => {
        setVmStates(prev => {
            const next: Record<number, 'running' | 'stopped'> = { ...prev };
            for (const v of props.assignedVms) {
                if (!(v.id in next)) next[v.id] = v.state;
            }
            for (const id of Object.keys(next)) {
                if (!props.assignedVms.find(v => v.id === Number(id))) {
                    delete next[Number(id)];
                }
            }
            return next;
        });
    }, [props.assignedVms]);

    const getVmState = (id: number) => vmStates[id] ?? 'stopped';
    const toggleVmState = (id: number) => {
        setVmStates(prev => ({ ...prev, [id]: prev[id] === 'running' ? 'stopped' : 'running' }));
    };

    const router = useRouter();


    return (
        <div className="flex flex-col space-y-4 bg-background m-5 rounded-[8] h-full">
            <ul>
                {props.assignedVms.map((vm) => (
                    <li key={vm.id} className="bg-lightforeground mb-4 p-2 border-2 border-lightforeground rounded-[8]">
                        <div className="flex flex-row w-full h-full">
                            <div className="flex flex-row flex-grow">
                                <ComputerIcon className="self-center ml-1 w-6 h-6"/>
                                <span className="self-center ml-4 w-5/10 h-fit text-lg">{vm.name}</span>
                            </div>
                            <StandardButton label="connect" className="" onClick={() => { router.push(`/vnc`); }} >
                                <ScreenShareIcon className="mr-1 size-5" />
                            </StandardButton>
                            <StandardButton label={getVmState(vm.id) === 'running' ? 'Stop' : 'Start'} className="ml-1" onClick={() => { toggleVmState(vm.id); }} >
                                <CirclePowerIcon className="mr-1 size-5" />
                            </StandardButton>
                            <StandardButton label="" className="ml-1" onClick={() => {setDeleteVmModalOpen(true); setVmModalId(vm.id);}} >
                                <Trash2Icon className="self-center p-0.5 rounded-[8] cursor-pointer" />
                            </StandardButton>
                            <DeleteVmModal isOpen={isDeleteVmModalOpen} onClose={() => {
                                setDeleteVmModalOpen(false);
                            }} onSubmit={() => {
                                if (vmModalId !== null) {
                                    const index = assignedVms.findIndex((vm) => vm.id === vmModalId)
                                    assignedVms.splice(index, 1);
                            
                                setVmModalId(null);
                                }
                                setDeleteVmModalOpen(false);
                            }} />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}







interface DeleteVmModalProps{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
}

export function DeleteVmModal({ isOpen, onClose, onSubmit }: DeleteVmModalProps) {
    return (
        <ConfirmModal title={"Delete VM"} description={"Are you sure you want to delete this VM? This action cannot be undone."} isOpen={isOpen} onClose={onClose} onConfirm={() => onSubmit()} />
    )
}

