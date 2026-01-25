import Spinner from "@/shared/Spinner";

interface StandardButtonProps {
  label: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  isLoading?: boolean;
  type?: "button" | "submit" | "reset";
}

export function StandardButton({
  label,
  onClick,
  className = "",
  disabled,
  children,
  isLoading = false,
  type = "button",
}: StandardButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading || false}
      className={
        "flex items-center rounded-[8] p-2 cursor-pointer hover:scale-110 transition-all duration-500 " +
        className +
        (disabled ? " opacity-50! cursor-not-allowed! hover:scale-100!" : "")
      }
      aria-busy={isLoading}
    >
      {isLoading ? (
        <Spinner outerClass="p-0.5 rounded-full" innerClass="w-5 h-5 border-t-2" />
      ) : (
        <>
          {children}
          <span className="">{label}</span>
        </>
      )}
    </button>
  );
}