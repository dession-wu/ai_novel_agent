// src/components/ui/separator.tsx

import React from 'react';

interface SeparatorProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  [key: string]: any;
}

const Separator: React.FC<SeparatorProps> = ({ className, orientation = 'horizontal', ...props }) => {
  if (orientation === 'horizontal') {
    return (
      <div
        className={`h-px w-full bg-gray-200 ${className || ''}`}
        {...props}
      />
    );
  } else {
    return (
      <div
        className={`h-full w-px bg-gray-200 ${className || ''}`}
        {...props}
      />
    );
  }
};

export { Separator };
