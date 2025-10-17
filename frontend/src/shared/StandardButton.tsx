import { FC } from "react";

interface StandardButtonProps {
    slug?: string;
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
}

export const StandardButton: FC<StandardButtonProps> = ({ slug, label, icon, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={
                "flex items-center rounded-[8] p-4 bg-background hover:bg-foreground cursor-pointer" +
                (slug === label.toLowerCase().replace(" ", "")
                    ? " bg-foreground"
                    : "")
            }
        >
            {icon && <span className="mr-4">{icon}</span>}
            <span className="">{label}</span>
        </button>
    );
}