import { FC, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface StandardSelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  children: ReactNode;
}

export const StandardSelect: FC<StandardSelectProps> = ({
  label,
  value,
  onChange,
  className = '',
  children,
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 font-medium text-sm">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full border border-lightforeground rounded-lg p-2 bg-background text-font appearance-none cursor-pointer hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-0 ${className}`}
        >
          {children}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-4 pointer-events-none text-lightforeground" />
      </div>
    </div>
  );
};
