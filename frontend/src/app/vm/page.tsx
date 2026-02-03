'use client';

import { StandardButton } from '@/shared/StandardButton';
import {
  LaptopMinimal,
  PlusIcon,
  Power,
  ScreenShareIcon,
  Square,
  SquareTerminal,
  Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
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
import { machine } from 'os';
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
    refetchInterval: 5000,
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
      {startMachineMutation.isPending ||
        (stopMachineMutation.isPending && <LoadingScreen />)}
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

        <div className="flex flex-row">
          {/* Virtual Machine Actions */}

          {vm.status === 'Running' ? (
            <>
              <div className="border-foreground border-r-2">
                <StandardButton
                  disabled={!ipv4}
                  className="bg-transparent!"
                  title="Stop Machine"
                  onClick={() => {
                    stopMachineMutation.mutate();
                  }}
                >
                  {<Square className="size-6" />}
                </StandardButton>
              </div>

              <StandardButton
                className="bg-transparent!"
                title="Connect via VNC"
                disabled={!ipv4}
                onClick={() => {
                  router.push(`/vnc?ip=${ipv4}`);
                }}
              >
                {<ScreenShareIcon className="size-6" />}
              </StandardButton>
            </>
          ) : (
            <StandardButton
              className="bg-transparent! mr-2"
              onClick={() => startMachineMutation.mutate()}
              title="Start Machine"
            >
              {<Power className="size-6 scale-105" />}
            </StandardButton>
          )}
        </div>
      </div>
      {/** Virtual Machine Details */}
      {isVirtualMachineDetailsOpen[index] && (
        <div className="flex flex-col">
          <div
            className={`flex flex-row relative bg-background p-4 pb-0! rounded-b-[8] w-full h-full`}
          >
            <div className="bg-background mx-4 border-lightforeground border-r-2 w-1/3 h-3/10">
              <div className="flex flex-row">
                <h6 className="grow">CPU </h6>
                <p className="text-font">{}</p>
              </div>
              <div className="flex flex-row">
                <h6 className="grow">SSD </h6>
                <p className="text-font">{}</p>
              </div>
            </div>
            <div className="bg-background mx-4 w-2/3 h-3/10">
              <div className="flex flex-row">
                <h6 className="grow">Image </h6>
                <p className="text-font">
                  {imageMap.get(vm.config['volatile.base_image'])}
                </p>
              </div>
              <div className="flex flex-row">
                <h6 className="grow">Location (for dev) </h6>
                <p className="text-font">{vm.location}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-start w-full h-17">
            <StandardButton
              className="justify-center items-center self-end bg-lightforeground hover:bg-lightforeground m-4 w-30"
              label="Delete"
              onClick={() => setDeleteModalOpen(true)}
            >
              <Trash2 className="mr-2 size-5" />
            </StandardButton>
            <StandardButton
              className="justify-center items-center self-end bg-lightforeground hover:bg-lightforeground m-4 mx-0 w-30"
              label="Terminal"
              onClick={() => {}}
            >
              <SquareTerminal className="mr-2 size-5" />
            </StandardButton>
          </div>
        </div>
      )}


      <DeleteVmModal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} onSubmit={() => deleteMachineMutation.mutate(vm.name)} />
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
