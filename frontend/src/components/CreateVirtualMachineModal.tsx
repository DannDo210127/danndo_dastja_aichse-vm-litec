import { createMachine, getAllImages } from '@/api/machines';
import { StandardButton } from '@/shared/StandardButton';
import { StandardInput } from '@/shared/StandardInput';
import StandardModal from '@/shared/StandardModal';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

interface CreateVirtualMachineModalProps {
  desc?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CreateVirtualMachineModal({
  isOpen,
  onClose,
  desc,
}: CreateVirtualMachineModalProps) {
  const queryClient = useQueryClient();

  const [hostname, setHostname] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [targetServer, setTargetServer] = useState<string>('');

  const images = useQuery({
    queryKey: ['images'],
    queryFn: () => getAllImages(),
  });

  const createVmMutation = useMutation({
    mutationFn: () =>
      createMachine({
        type: 'virtual-machine',
        hostname: hostname,
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
      description={desc || 'Here you can create your own dream machine'}
      isOpen={isOpen}
    >
      <div className="flex flex-col space-y-4 mt-4">
        <StandardInput
          maxLength={10}
          placeholder="Hostname"
          onValueChange={(value: string) => setHostname(value)}
        />

        <div>
          <label className="block mb-2 font-medium text-sm">
            Select Image:
          </label>
          <select
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="bg-background p-2 border border-lightforeground rounded w-full"
          >
            <option value="">None</option>
            {images.data?.map((img: any, index: number) => (
              <option key={index} value={img?.fingerprint}>
                {img?.aliases[0]
                  ? img?.aliases[0].name
                  : img.properties.description}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium text-sm">
            Target Server:
          </label>
          <select
            value={targetServer}
            onChange={(e) => setTargetServer(e.target.value)}
            className="bg-background p-2 border border-lightforeground rounded w-full"
          >
            <option value="">Select a server</option>
            <option value="server1">Primary Server</option>
          </select>
        </div>

        <div className="flex justify-between mt-2 w-full">
          <div className="flex gap-4 w-full">
            <StandardButton
              label="Cancel"
              onClick={onClose}
              className="bg-lightforeground px-6 py-3"
            />
            <StandardButton
              label="Create"
              onClick={() => createVmMutation.mutate()}
              className={'ml-1 h-full px-10 py-3 bg-lightforeground '}
            />
          </div>
        </div>
      </div>
    </StandardModal>
  );
}
