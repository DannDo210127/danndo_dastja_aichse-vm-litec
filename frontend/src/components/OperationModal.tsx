import StandardModal from "@/shared/StandardModal";
import { useOperationModalStore } from "@/store/operation-modal-store";
import { useQuery } from "@tanstack/react-query";
import { StandardButton } from "@/shared/StandardButton";
import { getCurrentOperations, getOperationStatus } from "@/api/operations";
import { Divide } from "lucide-react";
import Spinner from "@/shared/SmallLoading";

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
        queryKey: ["operation", operationId],
        queryFn: () => getOperationStatus(operationId!),
        enabled: !!operationId && isOpen,
    });

    const ops = useQuery({
        queryKey: ["operations"],
        queryFn: () => getCurrentOperations(),
        refetchInterval: 500
    });

    return (
        <StandardModal
            className="w-[600px]"
            title="Async Operation"
            description={`Operation ID: ${operationId}`}
            isOpen={isOpen}
        >
            <div className="flex flex-col space-y-4 mt-4">
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
                            ops.data.data.metadata.running.map((task: any, index: number) =>{
                                return (
                                    <div key={index}>
                                        <h1>{task.description}</h1>
                                        <div >
                                            {task.metadata ? <div>{task.metadata.progress.stage}: <b>{task.metadata.progress.percent}%</b></div> : null}
                                        </div>
                                    </div>
                                )
                            })
                        ) : <div>No more operations ongoing</div>}
                        {ops.data?.data?.metadata?.failure && (
                            ops.data.data.metadata.failure.map((task: any) =>{
                                return (
                                    <div>{task.err}</div>
                                )
                            })
                        )}
                        {operation.err && (
                            <div className="bg-red-50 dark:bg-red-950 p-2 rounded text-red-600 text-sm">
                                <p className="font-semibold">Error:</p>
                                <p>{operation.err}</p>
                            </div>
                        )}
                    </div>
                ) : null}

                <div className="flex justify-end pt-2">
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
