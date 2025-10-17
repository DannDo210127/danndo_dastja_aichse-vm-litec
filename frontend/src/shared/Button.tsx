import { Home } from "lucide-react";

interface ButtonProps {
  label: string;
  onclick?: () => void;
  className?: string;
}



export function Button({
  label,
  onclick,
  className,
}: ButtonProps) {


  return (
    <button
      onClick={onclick}
      className={"flex items-center rounded-[8] p-2 bg-foreground hover:bg-secondary" + 
                (className ? " " + className : "")}
    >
        <span className="">{label}</span>
    </button>
  );
}