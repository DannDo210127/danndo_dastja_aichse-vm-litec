import { Home } from "lucide-react";
import { usePathname } from "next/navigation";

interface ButtonProps {
  icon?: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  slug?: string;
}



export function Button({
  icon,
  label,
  slug,
  active = slug === label.toLowerCase().replace(" ", ""),
  onClick,
  className,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={"flex items-center rounded-[8] p-4 bg-background hover:bg-foreground cursor-pointer" + (className ? " " + className : "") + (active ? " bg-foreground" : "")}
    >
      {icon && <span className="mr-4">{icon}</span>}
      <span className="">{label}</span>
    </button>
  );
}