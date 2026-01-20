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
                    className="z-50 fixed inset-0 flex justify-center items-center bg-transparent backdrop-blur-xs"
                >
                    <div
                        className={`bg-transparent rounded-lg p-6 flex flex-col ${className}`}                            
                >
                    <div className="bg-transparent p-1 rounded-full scale-140 animate-spin">
                        <div className="border-1 border-transparent border-t-6 border-t-contrast rounded-full w-12 h-12"></div>
                    </div>
                    </div>
                </div>
        </Fragment>
    )
        
} 

