"use client";

import { StandardButton } from "@/shared/StandardButton";
import {
    LaptopMinimal,
    PlusIcon,
    Power,
    ScreenShareIcon,
    Square,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ConfirmModal } from "@/shared/ConfirmModal";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LoginModal } from "@/components/LoginModal";
import { useQuery } from "@tanstack/react-query";
import { getAssignedMachines } from "@/api/machines";
import { LoadingScreen } from "@/shared/LoadingScreen";
import { CreateVirtualMachineModal } from "@/components/CreateVirtualMachineModal";

/** Root Component */
export default function VirtualMachinePage() {
    const user = useAuth();
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);

    const [isCreateVirtualMachineModalOpen, setVmModalOpen] = useState(false);

    useEffect(() => {
        if (!user.isAuthenticated) {
            setLoginModalOpen(true);
        }
    }, [user.isAuthenticated]);

    return !user.isAuthenticated ? (
        <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setLoginModalOpen(false)}
            onSubmit={() => setLoginModalOpen(false)}
        />
    ) : (
        <div className="flex flex-col bg-background m-20 mx-25 rounded-[8] h-8/10 grow">
            <div className="flex flex-row justify-between items-center border-lightforeground border-b-2">
                <h2 className="m-5 p-2 font-bold text-2xl">
                    Your Virtual Machines
                </h2>
                <StandardButton
                    className="bg-lightforeground hover:bg-contrast! drop-shadow-sm p-2.5! hover:text-background hover:scale-105 transition-all"
                    label="Create VM"
                    onClick={() => {
                        setVmModalOpen(true);
                    }}
                >
                    <PlusIcon className="mr-1 size-6" />
                </StandardButton>
            </div>

            <VirtualMachinesList></VirtualMachinesList>

            {/** Modals */}
            <CreateVirtualMachineModal
                isOpen={isCreateVirtualMachineModalOpen}
                onClose={() => setVmModalOpen(false)}
            />
        </div>
    );
}

/** List of Virtual Machine Components */
export function VirtualMachinesList() {
    const machines = useQuery({
        queryKey: ["machines"],
        queryFn: () => getAssignedMachines(),
    });

    return machines.isLoading ? (
        <LoadingScreen />
    ) : (
        <div className="flex flex-col space-y-4 bg-background m-5 rounded-[8] h-full">
            {/** List of Virtual Machines */}
            <ul className="flex flex-col gap-4 h-full overflow-y-auto">
                {machines.data && machines.data.length > 0 ? (
                    machines.data.map((vm: any, index: number) => (
                        <VirtualMachineListEntry
                            key={index}
                            vm={vm}
                            index={index}
                        />
                    ))
                ) : (
                    <li className="p-4 text-font">
                        No Virtual Machines assigned.
                    </li>
                )}
            </ul>
        </div>
    );
}

interface VirtualMachineListEntryProps {
    vm: any;
    index: number;
}

const VirtualMachineListEntry: React.FC<VirtualMachineListEntryProps> = ({
    vm,
    index,
}) => {
    const router = useRouter();
    const [isVirtualMachineDetailsOpen, setVirtualMachineDetailsOpen] =
        useState<Record<number, boolean>>({});

    const toogleVirtualMachineDetailsOpen = (index: number) => {
        setVirtualMachineDetailsOpen((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    return (
        <div className="flex flex-col border-2 border-lightforeground rounded-[8]">
            <div
                className={`flex flex-row justify-between items-center bg-lightforeground drop-shadow-sm  border-lightforeground border-b-2 rounded-[5] w-full ${!isVirtualMachineDetailsOpen[index] ? "" : "rounded-b-none"}`}
            >
                <button
                    className="flex flex-row p-3 h-full grow"
                    onClick={() => toogleVirtualMachineDetailsOpen(index)}
                >
                    <div className="flex flex-row items-center ml-1 grow">
                        <LaptopMinimal className="mr-3 size-6" />
                        <div className="flex flex-col border-foreground border-r-2 w-30 text-left">
                            <div className="font-bold text-lg truncate">
                                {vm.name}
                            </div>
                        </div>
                        <div
                            className={` ml-4 ${vm.status == "Running" ? "bg-gradient-to-tr from-green-400 to-green-600" : "bg-gradient-to-bl from-red-300 to-red-600"} animate-spin w-3 h-3 rounded-full `}
                        ></div>
                        <p className="ml-2 text-md">{vm.status}</p>
                    </div>
                </button>
                {vm.status === "Running" ? (
                    <>
                        <div className="border-foreground border-r-2">
                            <StandardButton
                                className="bg-lightforeground"
                                label=""
                                onClick={() => {
                                    router.push(`/vnc`);
                                }}
                            >
                                {<Square className="size-6" />}
                            </StandardButton>
                        </div>

                        <StandardButton
                            className="bg-lightforeground"
                            label=""
                            onClick={() => {
                                router.push(`/vnc`);
                            }}
                        >
                            {<ScreenShareIcon className="size-6" />}
                        </StandardButton>
                    </>
                ) : (
                    <StandardButton
                        className="bg-lightforeground mr-2"
                        label=""
                    >
                        {<Power className="size-6 scale-105" />}
                    </StandardButton>
                )}
            </div>

            {/** Virtual Machine Details */}
            {isVirtualMachineDetailsOpen[index] && (
                <div
                    className={`flex flex-row relative bg-background p-4 rounded-b-[8] w-full h-full`}
                >
                    <div className="bg-background pr-10 border-lightforeground border-r-2 w-1/2 h-3/10">
                        <div className="flex flex-row">
                            <h6 className="grow">Image </h6>
                            <p className="mr-10 text-font">{vm.architecture}</p>
                        </div>
                        <div className="flex flex-row">
                            <h6 className="grow">Location (for dev) </h6>
                            <p className="mr-10 text-font">{vm.location}</p>
                        </div>
                    </div>
                    <div className="bg-background w-1/2 h-3/10"></div>
                </div>
            )}
        </div>
    );
};

interface DeleteVmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
}

export function DeleteVmModal({
    isOpen,
    onClose,
    onSubmit,
}: DeleteVmModalProps) {
    return (
        <ConfirmModal
            title={"Delete VM"}
            description={
                "Are you sure you want to delete this VM? This action cannot be undone."
            }
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={() => onSubmit()}
        />
    );
}
