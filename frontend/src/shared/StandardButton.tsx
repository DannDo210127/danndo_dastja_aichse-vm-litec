interface StandardButtonProps {
  label: string;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}



export function StandardButton({
  label,
  onClick,
  className,
  children,
}: StandardButtonProps) {


  return (
    <button
      onClick={onClick}
      className={"flex items-center rounded-[8] p-2 bg-foreground hover:bg-secondary cursor-pointer " + className}
    >
        {children}<span className="">{label}</span>
    </button>
  );
}