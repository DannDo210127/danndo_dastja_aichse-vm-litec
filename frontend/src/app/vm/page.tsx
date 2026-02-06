'use client';

import { StandardButton } from '@/shared/StandardButton';
import {
  LaptopMinimal,
  PlusIcon,
  ScreenShareIcon,
  Square,
  Trash2,
  Play,
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { ConfirmModal } from '@/shared/ConfirmModal';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LoginModal } from '@/components/LoginModal';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteMachine,
  getAllImages,
  getAssignedMachines,
  getMachineState,
  startMachine,
  stopMachine,
} from '@/api/machines';
import { LoadingScreen } from '@/shared/LoadingScreen';
import { CreateVirtualMachineModal } from '@/components/CreateVirtualMachineModal';
import { getCurrentOperations } from '@/api/operations';
import { useOperationModalStore } from '@/store/operation-modal-store';
import { LoadingBounce } from '@/shared/LoadingBounce';

/** Root Component */
export default function VirtualMachinePage() {
  const user = useAuth();
  const operationModal = useOperationModalStore.getState();
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  const [isCreateVirtualMachineModalOpen, setVmModalOpen] = useState(false);

  useEffect(() => {
    if (!user.isAuthenticated) {
      setLoginModalOpen(true);
    }
  }, [user.isAuthenticated]);

  const ops = useQuery({
    queryKey: ['operations'],
    queryFn: () => getCurrentOperations(),
    refetchInterval: 3000,
  });

  const activeOperations = ops.data?.data.metadata?.running?.length || 0;
  return !user.isAuthenticated ? (
    <LoginModal
      isOpen={isLoginModalOpen}
      onClose={() => setLoginModalOpen(false)}
      onSubmit={() => setLoginModalOpen(false)}
    />
  ) : (
    <div className="flex flex-col bg-background m-20 mx-25 rounded-[8] h-8/10 grow">
      <div className="flex flex-row justify-between items-center border-lightforeground border-b-2">
        <div className="m-5 p-2">
          <h2 className="font-bold text-2xl">Your Virtual Machines</h2>
          <p
            className={`ml-2 text-gray-400 cursor-pointer ${activeOperations > 0 ? 'text-yellow-400 animate-pulse' : ''}`}
            onClick={() => {
              activeOperations > 0 &&
                operationModal.open(ops.data?.data.metadata.running[0].id);
            }}
          >
            {activeOperations} active operations
          </p>
        </div>
        <StandardButton
          className="bg-lightforeground hover:bg-contrast! drop-shadow-sm p-2.5! hover:text-background hover:scale-105 transition-all"
          label="Create Virtual Machine"
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
    queryKey: ['machines'],
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
            <VirtualMachineListEntry key={index} vm={vm} index={index} />
          ))
        ) : (
          <li className="p-4 text-font">No Virtual Machines assigned.</li>
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
  const queryClient = useQueryClient();
  const [isVirtualMachineDetailsOpen, setVirtualMachineDetailsOpen] = useState<
    Record<number, boolean>
  >({});
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const toogleVirtualMachineDetailsOpen = (index: number) => {
    setVirtualMachineDetailsOpen((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const stopMachineMutation = useMutation({
    mutationFn: () => stopMachine(vm.name, true),
    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['machines'] });
      }, 1000);
    },
  });

  const startMachineMutation = useMutation({
    mutationFn: () => startMachine(vm.name, true),
    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['machines'] });
      }, 1000);
    },
  });

  const deleteMachineMutation = useMutation({
    mutationFn: () => deleteMachine(vm.name),
    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['machines'] });
      }, 1000);
    },
  });

  const machineState = useQuery({
    queryFn: () => getMachineState(vm.name),
    queryKey: ['machineState', vm.name],
    refetchInterval: 5000,
  });

  const ipv4 =
    machineState.data?.metadata.network?.enp5s0?.addresses[0]?.address;

  const images = useQuery({
    queryKey: ['images'],
    queryFn: () => getAllImages(),
  });

  const imageMap = new Map<string, string>();
  images.data?.forEach((img: any) => {
    imageMap.set(
      img.fingerprint,
      img.aliases[0] ? img.aliases[0].name : img.properties.description,
    );
  });

  return (
    <div className="flex flex-col border-2 border-lightforeground rounded-[8]">
      {deleteMachineMutation.isPending ||
        stopMachineMutation.isPending ||
        (startMachineMutation.isPending && <LoadingScreen />)}
      <div
        className={`flex flex-row justify-between items-center bg-lightforeground drop-shadow-sm  border-lightforeground border-b-2 rounded-[5] w-full ${!isVirtualMachineDetailsOpen[index] ? '' : 'rounded-b-none'}`}
      >
        <button
          className="flex flex-row p-3 h-full grow"
          onClick={() => toogleVirtualMachineDetailsOpen(index)}
        >
          <div className="flex flex-row items-center ml-1 grow">
            <LaptopMinimal className="mr-3 size-6" />
            <div className="flex flex-col border-foreground border-r-2 w-30 text-left">
              <div className="font-bold text-lg truncate">{vm.name}</div>
            </div>
            <div
              className={` ml-4 ${
                vm.status == 'Running'
                  ? `${
                      ipv4
                        ? 'bg-gradient-to-tr from-green-400 to-green-600'
                        : 'bg-gradient-to-tr from-yellow-400 to-yellow-600'
                    }`
                  : 'bg-gradient-to-bl from-red-300 to-red-600'
              } animate-spin w-3 h-3 rounded-full `}
            ></div>
            <p className="ml-2">
              {ipv4
                ? vm.status
                : vm.status == 'Stopped'
                  ? vm.status
                  : 'Starting'}
            </p>
            {ipv4 && vm.status == 'Running' ? (
              <p className="flex ml-2 text-md">{'[' + ipv4 + ']'}</p>
            ) : (
              vm.status == 'Running' && <LoadingBounce />
            )}
          </div>
        </button>

        <div className="relative flex flex-row items-center gap-2 mr-2">
          {vm.status === 'Running' ? (
            <>
              <StandardButton
                className="bg-transparent! p-2 text-sm"
                onClick={() => stopMachineMutation.mutate()}
                title="Stop Machine"
              >
                <Square className="size-5" strokeWidth={2.5} />
              </StandardButton>

              <StandardButton
                className="bg-transparent! p-2 text-sm"
                disabled={!ipv4}
                onClick={() => {
                  if (ipv4) router.push(`/vnc?ip=${ipv4}`);
                }}
                title="Connect via VNC"
              >
                <ScreenShareIcon className="size-5" strokeWidth={2.5} />
              </StandardButton>
            </>
          ) : (
            <StandardButton
              className="bg-transparent! p-2 text-sm"
              onClick={() => startMachineMutation.mutate()}
              title="Start Machine"
            >
              <Play className="size-5" strokeWidth={2.5} />
            </StandardButton>
          )}

          <StandardButton
            className="bg-transparent! p-2 text-sm"
            onClick={() => setDeleteModalOpen(true)}
            title="Delete VM"
          >
            <Trash2 className="size-5" strokeWidth={2.5} />
          </StandardButton>
        </div>
      </div>
      {/** Virtual Machine Details */}
      {isVirtualMachineDetailsOpen[index] && (
        <div className="flex flex-col">
          <div className="relative bg-background p-4 rounded-b-[8] w-full">
            <div className="gap-4 grid grid-cols-2">
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-lightforeground border-b">
                  <span className="text-gray-500 text-sm">CPU</span>
                  <span className="font-medium">
                    {vm.config?.['limits.cpu'] || vm.config?.['cpu'] || '—'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-lightforeground border-b">
                  <span className="text-gray-500 text-sm">Memory</span>
                  <span className="font-medium">
                    {vm.config?.['limits.memory'] ||
                      vm.config?.['memory'] ||
                      '—'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-500 text-sm">Storage</span>
                  <span className="font-medium">
                    {vm.config?.['root.size'] ||
                      vm.config?.['limits.disk'] ||
                      '—'}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-lightforeground border-b">
                  <span className="text-gray-500 text-sm">Image</span>
                  <span className="font-medium">
                    {imageMap.get(vm.config?.['volatile.base_image']) ||
                      'Unknown'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-lightforeground border-b">
                  <span className="text-gray-500 text-sm">Location</span>
                  <span className="font-medium">{vm.location || '—'}</span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-500 text-sm">IP</span>
                  <span className="font-medium">{ipv4 || '—'}</span>
                </div>
              </div>
            </div>

            {/* Bottom section with UUID and timestamps */}
            <div className="flex justify-between items-end pt-4 border-lightforeground border-t text-gray-500 text-xs">
              <div className="flex items-end gap-2">
                <span>UUID:</span>
                <span className="max-w-xs font-medium text-font text-xs truncate">
                  {vm.config?.['volatile.cloud-init.instance-id'] || '—'}
                </span>
              </div>
              <div className="flex items-end gap-6">
                <div className="flex items-end gap-2">
                  <span>Created:</span>
                  <span className="font-medium text-font">
                    {vm.created_at
                      ? new Date(vm.created_at).toLocaleDateString()
                      : '—'}
                  </span>
                </div>
                <div className="flex items-end gap-2">
                  <span>Last Used:</span>
                  <span className="font-medium text-font">
                    {vm.last_used_at
                      ? new Date(vm.last_used_at).toLocaleDateString()
                      : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <DeleteVmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onSubmit={() => {
          setDeleteModalOpen(false);
          deleteMachineMutation.mutate(vm.name);
        }}
      />
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
      title={'Delete VM'}
      description={
        'Are you sure you want to delete this VM? This action cannot be undone.'
      }
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={() => onSubmit()}
    />
  );
}
