import { FC, Fragment, useEffect } from "react";
import { createPortal } from "react-dom";


interface LoadingScreenProps {
    className?: string; 
}

export function LoadingScreen(props: LoadingScreenProps){
    const className = props.className || "";
     
    return (
        <Fragment>
                 <div
                    className="fixed inset-0 flex items-center justify-center bg-black/30 z-50"
                >
                    <div
                        className={`bg-transparent rounded-lg p-6 flex flex-col ${className}`}                            
                >
                    <div className="rounded-full  bg-transparent animate-spin scale-140 p-1">
                        <div className="border-1 border-t-6 border-t-white border-transparent rounded-full h-12 w-12"></div>
                    </div>
                    </div>
                </div>
        </Fragment>
    )
        
} 

