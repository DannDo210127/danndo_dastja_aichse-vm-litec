import StandardModal from '@/shared/StandardModal';
import { useOperationModalStore } from '@/store/operation-modal-store';
import { useQuery } from '@tanstack/react-query';
import { StandardButton } from '@/shared/StandardButton';
import { getCurrentOperations, getOperationStatus } from '@/api/operations';

export function OperationModal() {
  const {
    operationId,
    isOpen,
    close: closeOperationModal,
  } = useOperationModalStore();

  const {
    data: operation,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['operation', operationId],
    queryFn: () => getOperationStatus(operationId!),
    enabled: !!operationId && isOpen,
  });

  const ops = useQuery({
    queryKey: ['operations'],
    queryFn: () => getCurrentOperations(),
    refetchInterval: 500,
  });

  const extractMachineNameFromDescription = (description: string) => {
    // Try to extract machine name from description like "Create instance foo"
    const match = description.match(/(?:Create instance|Starting instance|Stopping instance)\s+(\S+)/i);
    return match ? match[1] : 'Machine';
  };

  return (
    <StandardModal
      className="w-[600px]"
      title="Hyphervisor Operations"
      description={`Operation ID: ${operationId}`}
      isOpen={isOpen}
    >
      <div className="flex flex-col space-y-4 mt-4 rounded-[8] p-4">
        {isLoading ? (
          <div className="py-4 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Loading operation status...
            </p>
          </div>
        ) : error ? (
          <div className="py-4 text-center">
            <p className="text-red-500">Error loading operation</p>
          </div>
        ) : operation ? (
          <div className="space-y-3">
            {ops.data?.data?.metadata?.running ? (
              ops.data.data.metadata.running.map((task: any, index: number) => {
                const machineName = extractMachineNameFromDescription(task.description);
                const stage = task.metadata?.progress?.stage || 'Processing';
                const percent = task.metadata?.progress?.percent || 0;

                return (
                  <div key={index} className="space-y-2 bg-white drop-shadow-md rounded-[8] p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-base">{machineName}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {task.description}
                        </p>
                        {task.metadata?.progress?.stage && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            Stage: <span className="font-medium">{stage}</span>
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-font">
                          {percent}%
                        </p>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-lightforeground rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-yellow-300 h-full rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div>No more operations ongoing</div>
            )}
            {ops.data?.data?.metadata?.failure &&
              ops.data.data.metadata.failure.map((task: any, index: number) => {
                return (
                  <div
                    key={index}
                    className="bg-red-50 dark:bg-red-950 p-3 rounded text-red-600 text-sm"
                  >
                    {task.err}
                  </div>
                );
              })}
            {operation.err && (
              <div className="bg-red-50 dark:bg-red-950 p-2 rounded text-red-600 text-sm">
                <p className="font-semibold">Error:</p>
                <p>{operation.err}</p>
              </div>
            )}
          </div>
        ) : null}

        <div className="flex justify-end border-t border-lightforeground pt-4 mt-4">
          <StandardButton
            label="Close"
            onClick={closeOperationModal}
            className="bg-lightforeground px-6 py-3"
          />
        </div>
      </div>
    </StandardModal>
  );
}
