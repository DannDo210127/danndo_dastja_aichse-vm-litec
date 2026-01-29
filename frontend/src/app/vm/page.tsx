'use client'

import { StandardButton } from "@/shared/StandardButton";
import { CirclePower, ComputerIcon, LaptopMinimal, PlusIcon,  Power,  ScreenShareIcon, Trash2Icon } from "lucide-react";
import { FC, use, useEffect, useReducer, useState } from "react";
import StandardModal  from "@/shared/StandardModal";
import { StandardInput } from "@/shared/StandardInput";
import {Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ConfirmModal } from "@/shared/ConfirmModal";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LoginModal } from "@/components/LoginModal";
import { useQuery } from "@tanstack/react-query";
import { getAssignedMachines } from "@/api/machines";
import { LoadingScreen } from "@/shared/LoadingScreen";


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
            <div className="flex flex-col bg-background m-20 mx-25 rounded-[8] h-8/10 grow">
                <div className="flex flex-row justify-between items-center border-lightforeground border-b-2">
                    <h2 className="m-5 p-2 font-bold text-2xl">Your Virtual Machines</h2>
                    <StandardButton className="bg-lightforeground hover:bg-contrast! drop-shadow-sm p-2.5! hover:text-background hover:scale-105 transition-all" label="Create VM" onClick={() => {setVmModalOpen(true);}} >
                        <PlusIcon className="mr-1 size-6" />
                    </StandardButton>
                </div>
               
                <VmComponentList></VmComponentList>
                <CreateVmModal errormessage={vmErrorMessage} images={images} isOpen={isVmModalOpen} onClose={() => setVmModalOpen(false)} onSubmit={(Vmname, selectedImage) => {
                    //TODO createVM submit to database
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



export function VmComponentList(){

    const [isOpen, setIsOpen] = useState<Record<number, boolean>>({});

    const machines = useQuery({
        queryKey: ['machines'],
        queryFn: () => getAssignedMachines() 
    });

    const toggleOpen = (index: number) => {
        setIsOpen(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const router = useRouter();

    return (
        
        machines.isLoading ? <LoadingScreen /> :
        <div className="flex flex-col space-y-4 bg-background m-5 rounded-[8] h-full">
            <ul className="flex flex-col gap-4 h-full overflow-y-auto">
                {machines.data && machines.data.length > 0 ? machines.data.map((vm: any, index: number) => (
                    <div key={index} className="flex flex-col border-2 border-lightforeground rounded-[8]">
                        <div className={`flex flex-row justify-between items-center bg-lightforeground drop-shadow-sm  border-lightforeground border-b-2 rounded-[5] w-full ${!isOpen[index]? '' : 'rounded-b-none'}`}>
                            <button  className='flex flex-row p-3 h-full grow'
                                onClick={() => {toggleOpen(index); console.log(vm.status)}}
                            >
                                <div className="flex flex-row items-center ml-1 grow">
                                    <LaptopMinimal className="mr-3 size-6" />
                                    <div className="flex flex-col">
                                        <div className="font-bold text-lg">{vm.name || vm.id || 'VM'}</div>
                                    </div>
                                    <div className={`${vm.status == 'Running' ? 'bg-green-500' : 'bg-red-400'} w-3 h-3 rounded-full ml-3 `} ></div>
                                </div>
                            </button>
                            {vm.status === 'Running' ? 
                                <StandardButton
                                    className="bg-lightforeground mr-4"
                                    label="connect"
                                    disabled={vm.status !== 'Running'}
                                    onClick={() => { router.push(`/vnc`); }}
                                >
                                    {<ScreenShareIcon className="mr-2 size-6" />} 
                                </StandardButton>
                             : 
                                <StandardButton className="bg-lightforeground mr-4" label="boot vm" >                   
                                    {<CirclePower className="mr-2 size-6 thick" />} 
                                    
                                </StandardButton>
                            }


                            

                        </div>


                        { isOpen[index] && 
                            <div className={`flex flex-row relative bg-background p-4 rounded-b-[8] w-full h-full`}>
                                <div className="bg-background pr-10 border-lightforeground border-r-2 w-1/2 h-3/10">
                                    <div className="flex flex-row">
                                        <h6 className="grow">Image </h6>
                                        <p className="mr-10 text-font">{vm.architecture}</p> 
                                        
                                    </div>
                                    <div className="flex flex-row">
                                        <h6 className="grow">Status </h6>
                                        <p className="mr-10 text-font">{vm.status}</p>
                                    </div>
                                    
                                    <div className="flex flex-row">
                                        <h6 className="grow">Location (for dev) </h6>
                                        <p className="mr-10 text-font">{vm.location}</p>
                                    </div>
                                </div>
                                 <div className="bg-background w-1/2 h-3/10">
                                    
                                </div>
                                
                            </div>
                        }
                    </div>
                    
                )) : <li className="p-4 text-font">No Virtual Machines assigned.</li>}
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

