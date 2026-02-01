import { FC } from 'react';

interface StandardInputProps {
  type?: string;
  placeholder?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  maxLength?: number | 100;
}

export const StandardInput: FC<
  StandardInputProps & React.InputHTMLAttributes<HTMLInputElement>
> = ({
  placeholder,
  onValueChange,
  type,
  maxLength,
  className = '',
  ...props
}) => {
  return (
    <input
      maxLength={maxLength}
      type={type ? type : 'text'}
      placeholder={placeholder}
      onChange={(e) => onValueChange?.(e.target.value)}
      className={`
                "w-full border border-lightforeground rounded-lg p-2 " +
                className
            `}
      {...props}
    />
  );
};
