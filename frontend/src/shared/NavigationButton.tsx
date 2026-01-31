import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";

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
            className={clsx(
                "flex items-center bg-background hover:bg-foreground p-4 rounded-[8] cursor-pointer",
                className,
                isActive && "bg-foreground",
            )}
        >
            {icon && <span className="mr-4">{icon}</span>}
            <span className="truncate">{label}</span>
        </button>
    );
}
