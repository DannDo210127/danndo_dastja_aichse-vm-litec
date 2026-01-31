import { FC, Fragment, useEffect } from "react";
import { createPortal } from "react-dom";
import Spinner from "@/shared/Spinner";

interface LoadingScreenProps {
    className?: string;
}

export function LoadingScreen(props: LoadingScreenProps) {
    const className = props.className || "";

    return (
        <Fragment>
            <div className="z-50 fixed inset-0 flex justify-center items-center bg-transparent backdrop-blur-xs">
                <div
                    className={`bg-transparent rounded-lg p-6 flex flex-col ${className}`}
                >
                    <Spinner
                        outerClass="p-1 rounded-full scale-140"
                        innerClass="w-12 h-12 border-t-6"
                    />
                </div>
            </div>
        </Fragment>
    );
}
