import { FC } from "react";

interface SpinnerProps {
  outerClass?: string;
  innerClass?: string;
}

export const Spinner: FC<SpinnerProps> = ({ outerClass = "p-1 rounded-full", innerClass = "w-12 h-12 border-t-6" }) => {
  return (
    <div className={`bg-transparent ${outerClass} animate-spin`}>
      <div className={`border-1 border-transparent border-t-contrast rounded-full ${innerClass}`}></div>
    </div>
  );
};

export default Spinner;
