import { usePathname, useRouter } from "next/navigation";

interface NavigationButtonProps {
  icon?: React.ReactNode;
  label: string;
  href?: string;
  className?: string;
  onClick?: () => void;
}


export function NavigationButton({
  icon,
  label,
  href,
  className,
  onClick,
}: NavigationButtonProps) {

  const pathname = usePathname();
  const router = useRouter();

  const isActive = pathname === href;
    
  return (
    <button
      onClick={href ? () => router.push(href) : onClick}
      className={"flex items-center rounded-[8] p-4 bg-background hover:bg-foreground cursor-pointer" + 
                (className ? " " + className : "") + 
                (isActive ? " bg-foreground" : "")}
    >
      {icon && <span className="mr-4">{icon}</span>}
      <span className="">{label}</span>
    </button>
  );
}