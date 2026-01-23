interface StandardButtonProps {
  label: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}



export function StandardButton({
  label,
  onClick,
  className,
  disabled,
  children,
}: StandardButtonProps) {


  return (
    <button
      onClick={onClick}
      disabled={disabled || false}
      className={"flex items-center rounded-[8] p-2 cursor-pointer hover:scale-108 transition-all duration-200 " + className + (disabled ? " opacity-50! cursor-not-allowed! hover:scale-100!" : "")}
    >
        {children}<span className="">{label}</span>
    </button>
  );
}