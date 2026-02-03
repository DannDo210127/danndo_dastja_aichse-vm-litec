import { getClusters } from '@/api/cluster';
import { createMachine, getAllImages } from '@/api/machines';
import { StandardButton } from '@/shared/StandardButton';
import { StandardInput } from '@/shared/StandardInput';
import { StandardSelect } from '@/shared/StandardSelect';
import StandardModal from '@/shared/StandardModal';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import cluster from 'cluster';
import { useEffect, useState } from 'react';

interface CreateVirtualMachineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateVirtualMachineModal({
  isOpen,
  onClose,
}: CreateVirtualMachineModalProps) {
  const queryClient = useQueryClient();

  const [hostname, setHostname] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [targetServer, setTargetServer] = useState<string>('');

  // Fetch available images (OS images) when modal opens
  const { data: images } = useQuery({
    queryKey: ['images'],
    queryFn: () => getAllImages(),
    enabled: isOpen
  });

  // Fetch available clusters/targets when modal opens
  const { data: clusters} = useQuery({
      queryKey: ["clusters"],
      queryFn: () => getClusters(),
      enabled: isOpen
  })

  // Extract target server names from cluster metadata
  const target: String[] = clusters?.metadata.map((cl: String) => cl.split("/")[4]);

  // Mutation for creating a new virtual machine
  const createVirtualMachineMutation = useMutation({
    mutationFn: () =>
      createMachine({
        type: 'virtual-machine',
        hostname: hostname,
        target: targetServer,
        source: {
          type: 'image',
          fingerprint: image,
        },
      }),
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries({ queryKey: ['machines'] });
    },
  });



  return (
    <StandardModal
      className="w-96"
      title={'Create Virtual Machine'}
      description={'Here you can create your own dream machine'}
      isOpen={isOpen}
    >
      {/* Modal Content */}
      <div className="flex flex-col space-y-4 mt-4">
        {/* Hostname Input */}
        <StandardInput
          maxLength={10}
          placeholder="Hostname"
          onValueChange={(value: string) => setHostname(value)}
        />

        {/* Image Selection Dropdown */}
        <StandardSelect
          label="Select Image:"
          value={image}
          onChange={setImage}
        >
          <option value="">None</option>
          {images?.map((img: any, index: number) => (
            <option key={index} value={img?.fingerprint}>
              {img?.aliases[0]
                ? img?.aliases[0].name
                : img.properties.description}
            </option>
          ))}
        </StandardSelect>

        {/* Target Server Selection Dropdown */}
        <StandardSelect
          label="Target Server:"
          value={targetServer}
          onChange={setTargetServer}
        >
          {target?.map((server: any, index: number) => (
            <option key={index} value={server}>
              {server}
            </option>
          ))}
        </StandardSelect>

        {/* Action Buttons: Cancel and Create */}
        <div className="flex justify-between mt-2 w-full">
          <div className="flex gap-4 w-full">
            <StandardButton
              label="Cancel"
              onClick={onClose}
              className="bg-lightforeground px-6 py-3"
            />
            <StandardButton
              label="Create"
              onClick={() => createVirtualMachineMutation.mutate()}
              className={'ml-1 h-full px-10 py-3 bg-lightforeground '}
            />
          </div>
        </div>
      </div>
    </StandardModal>
  );
}
