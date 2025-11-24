import { FC, Fragment } from "react";
import { createPortal } from "react-dom";

interface StandardModalProps {
    title: string;
    description: string;
    isOpen: boolean;
    children?: React.ReactNode;
    className?: string;
}

const StandardModal: FC<StandardModalProps> = ({ title, description, isOpen, children, className }) => {
    if (typeof window === "undefined") {
        return null;
    }

    return createPortal(
        <Fragment>
            {isOpen ? 
            (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black/30 z-50"
                >
                    <div
                        className={`bg-background rounded-lg p-6 shadow-lg flex flex-col ${className}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-col gap-0 border-b-1 border-b-lightforeground pb-3">
                            <h2 className="text-xl font-semibold">{title}</h2>
                            <p className="text-sm text-font font-light">{description}</p>
                        </div>
                        {children}
                    </div>
                </div>
            ) : null}
        </Fragment>,
        document.getElementById("modal-root") as HTMLElement
    );
};

export default StandardModal;