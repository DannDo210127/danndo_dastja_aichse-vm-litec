import { FC, Fragment, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface LoadingScreenProps {
  className?: string;
}

export function LoadingScreen(props: LoadingScreenProps) {
  const className = props.className || '';

  return (
    <Fragment>
      <style>{`

                    .animate-rotate-one {
                    animation: rotate-one 1s linear infinite;
                    }

                    @keyframes rotate-one {
                    0% { transform: rotateX(35deg) rotateY(-45deg) rotateZ(0deg); }
                    100% { transform: rotateX(35deg) rotateY(-45deg) rotateZ(360deg); }
                    }

                    @keyframes rotate-two {
                    0% { transform: rotateX(50deg) rotateY(10deg) rotateZ(0deg); }
                    100% { transform: rotateX(50deg) rotateY(10deg) rotateZ(360deg); }
                    }

                    @keyframes rotate-three {
                    0% { transform: rotateX(35deg) rotateY(55deg) rotateZ(0deg) ;}
                    100% { transform: rotateX(35deg) rotateY(55deg) rotateZ(360deg) ;  }
                    }

                    
                    .animate-rotate-two {
                    animation: rotate-two 1s linear infinite;
                    }
                    .animate-rotate-three {
                    animation: rotate-three 1s linear infinite;
                    }
            `}</style>
      <div className="z-50 fixed inset-0 flex justify-center items-center bg-transparent backdrop-blur-xs">
        <div
          className={`bg-transparent rounded-lg p-6 flex flex-col ${className}`}
        >
          <div className="top-1/2 left-1/2 absolute rounded-full w-16 h-16 -translate-x-1/2 -translate-y-1/2 duration-300 [perspective:800px]">
            <div className="absolute inset-0 border-b-[5px] border-b-contrast rounded-full animate-rotate-one"></div>
            <div className="absolute inset-0 border-r-[5px] border-r-contrast rounded-full animate-rotate-two"></div>
            <div className="absolute inset-0 border-t-[5px] border-t-contrast rounded-full animate-rotate-three"></div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
