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
  size?: 'small' | 'default' | 'large';
  shadow?: boolean;
  icon?: React.ReactNode;
}

const Button = ({
  children,
  className,
  onClick,
  disabled = false,
  variant = 'main',
  type = 'button',
  size = 'default',
  shadow = true,
  icon,
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      className={cn(
        'relative z-10 flex h-[48px] items-center justify-center gap-1 rounded-lg border px-[30px] font-semibold text-subtext hover:shadow-hover',
        shadow && 'shadow-custom',
        variant === 'main' && 'bg-mainAccent',
        variant === 'secondary' && 'bg-secondaryAccent',
        variant === 'third' && 'bg-thirdAccent',
        size === 'small' && 'h-10 px-5 text-[14px]',
        className,
      )}
    >
      {icon}
      {children}
    </button>
  );
};

export default Button;
