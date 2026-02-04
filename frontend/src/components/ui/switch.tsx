// src/components/ui/switch.tsx

import React from 'react';

interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  [key: string]: any;
}

const Switch: React.FC<SwitchProps> = ({ checked = false, onCheckedChange, className, ...props }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange?.(!checked)}
      className={`
        relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full 
        transition-all duration-300 ease-out
        focus-visible:outline-none focus-visible:ring-2 
        focus-visible:ring-primary/50 focus-visible:ring-offset-2
        ${checked 
          ? 'bg-gradient-to-r from-primary to-primary/80 shadow-primary/30 shadow-md' 
          : 'bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-500'
        }
        ${className || ''}
      `}
      {...props}
    >
      <span
        className={`
          inline-block h-6 w-6 transform rounded-full bg-white shadow-lg
          transition-all duration-300 ease-out
          ${checked ? 'translate-x-6' : 'translate-x-0.5'}
        `}
      />
    </button>
  );
};

export { Switch };
