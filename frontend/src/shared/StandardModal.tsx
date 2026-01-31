import { useThemeStore } from "@/store/theme-store";
import { FC, Fragment, useEffect } from "react";
import { createPortal } from "react-dom";

interface StandardModalProps {
    title: string;
    description: string;
    isOpen: boolean;
    children?: React.ReactNode;
    className?: string;
}

const StandardModal: FC<StandardModalProps> = ({
    title,
    description,
    isOpen,
    children,
    className,
}) => {
    if (typeof window === "undefined") {
        return null;
    }

    return createPortal(
        <Fragment>
            {isOpen ? (
                <div
                    className={`z-50 fixed inset-0 flex justify-center items-center bg-black/20`}
                >
                    <div
                        className={`bg-background rounded-lg p-6  flex flex-col ${className}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-col gap-0 pb-3 border-b-1 border-b-lightforeground">
                            <h2 className="font-semibold text-xl">{title}</h2>
                            <p className="font-light text-font text-sm">
                                {description}
                            </p>
                        </div>
                        {children}
                    </div>
                </div>
            ) : null}
        </Fragment>,
        document.getElementById("modal-root") as HTMLElement,
    );
};

export default StandardModal;
