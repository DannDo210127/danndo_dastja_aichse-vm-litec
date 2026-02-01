import { FC } from "react";



export const LoadingBounce: FC = () => {
    return (
        <div className="flex items-center space-x-1 ml-3">
                    <div
                        className="bg-contrast rounded-full w-1.5 h-1.5 animate-[bounce_0.9s_infinite_ease-in-out]"
                        style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                        className="bg-contrast rounded-full w-1.5 h-1.5 animate-[bounce_0.9s_infinite_ease-in-out]"
                        style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                        className="bg-contrast rounded-full w-1.5 h-1.5 animate-[bounce_0.9s_infinite_ease-in-out]"
                        style={{ animationDelay: "300ms" }}
                    ></div>
                </div>
    );
};

export default LoadingBounce;
