import React from 'react';

import { cn } from '@/lib/utils/cn';

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  // eslint-disable-next-line no-unused-vars
  onClick?: (() => void) | ((e: any) => void);
  variant?: 'main' | 'secondary' | 'third';
  type?: 'button' | 'submit' | 'reset';
}

const Button = ({
  children,
  className,
  onClick,
  disabled = false,
  variant = 'main',
  type = 'button',
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      className={cn(
        'shadow-custom hover:shadow-hover text-subtext relative z-10 !h-[48px] rounded-lg border px-[30px] font-semibold',
        variant === 'main' && 'bg-mainAccent',
        variant === 'secondary' && 'bg-secondaryAccent',
        variant === 'third' && 'bg-thirdAccent',
        className,
      )}
    >
      {children}
    </button>
  );
};

export default Button;
