import { forwardRef, InputHTMLAttributes } from 'react';

import { cn } from '@/lib/utils/cn';

export interface CustomInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  prefix?: string;
  prefixClassName?: string;
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  (
    {
      label,
      error,
      containerClassName,
      labelClassName,
      inputClassName,
      errorClassName,
      prefix,
      prefixClassName,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        className={cn(
          'w-full font-medium text-subtext md:text-lg',
          containerClassName,
        )}
      >
        {label && (
          <label
            htmlFor={props.id}
            className={cn('mb-2 block font-semibold', labelClassName)}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {prefix && (
            <span
              className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2',
                prefixClassName,
              )}
            >
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full rounded-lg border bg-bg p-3 placeholder-subtext/60',
              'focus:border-border focus:outline-none focus:ring-1 focus:ring-border',
              prefix && 'pl-8',
              inputClassName,
            )}
            {...props}
          />{' '}
        </div>
        {error && (
          <p className={cn('mt-2 font-semibold text-red-400', errorClassName)}>
            {error}
          </p>
        )}
      </div>
    );
  },
);

CustomInput.displayName = 'CustomInput';

export { CustomInput };
