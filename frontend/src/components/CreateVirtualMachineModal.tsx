import { createMachine, getAllImages } from "@/api/machines";
import { StandardButton } from "@/shared/StandardButton";
import { StandardInput } from "@/shared/StandardInput";
import StandardModal from "@/shared/StandardModal";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface CreateVirtualMachineModalProps {
    isOpen: boolean;
    onClose: () => void;
}


export function CreateVirtualMachineModal({isOpen, onClose }: CreateVirtualMachineModalProps) {
    const [hostname, setHostname] = useState<string>("");
    const [image, setImage] = useState<string>("");
    const [autostart, setAutostart] = useState<string>("");

    const images = useQuery({
        queryKey: ['images'],
        queryFn: () => getAllImages()
    });

    const createVmMutation = useMutation({
        mutationFn: () => createMachine({
            hostname: hostname,
            source: {
                type: "image",
                fingerprint: image
            }
        }),
        onSuccess: () => {
            onClose();
        },
    });

    return (
        <StandardModal className="w-96" title={"Create Virtual Machine"} description={"Here you can create your own dream machine"} isOpen={isOpen}>
            <div className="flex flex-col space-y-4 mt-4">
                <StandardInput  placeholder="Hostname" onValueChange={(value: string) => setHostname(value)} />
                
                <div>
                    <label className="block mb-2 text-sm font-medium">Select Image:</label>
                    <select 
                        value={image} 
                        onChange={(e) => setImage(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded bg-white" 
                    >
                        <option value="">None</option>
                        {images.data?.map((img: string) => (
                            <option key={img} value={img}>{img}</option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-between mt-2 w-full">
                    <div className="flex gap-4 w-full">
                        <StandardButton label="Cancel" onClick={onClose} className="bg-lightforeground px-6 py-3" />
                        <StandardButton label="Create" onClick={() => createVmMutation.mutate()} className={"ml-1 h-full px-10 py-3 bg-lightforeground "} />
                    </div>
                </div>
            </div>
        </StandardModal>
    )
}

