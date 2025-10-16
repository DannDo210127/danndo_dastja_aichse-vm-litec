import { Home } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface NavigationButtonProps {
  icon?: React.ReactNode;
  label: string;
  active?: boolean;
  href: string;
  className?: string;
}


export function NavigationButton({
  icon,
  label,
  href,
  active = usePathname() === href,
  className,
}: NavigationButtonProps) {

  const router = useRouter();
    
  return (
    <button
      onClick={() => router.push(href)}
      className={"flex items-center rounded-[8] p-4 bg-background hover:bg-foreground" + 
                (className ? " " + className : "") + 
                (active ? " bg-foreground" : "")}
    >
      {icon && <span className="mr-4">{icon}</span>}
      <span className="">{label}</span>
    </button>
  );
}