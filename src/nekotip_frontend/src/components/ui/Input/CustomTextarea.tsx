import { forwardRef, TextareaHTMLAttributes } from 'react';

import { cn } from '@/lib/utils/cn';

export interface CustomTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  textareaClassName?: string;
  errorClassName?: string;
}

const CustomTextarea = forwardRef<HTMLTextAreaElement, CustomTextareaProps>(
  (
    {
      label,
      error,
      containerClassName,
      labelClassName,
      textareaClassName,
      errorClassName,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        className={cn(
          'w-full text-lg font-medium text-subtext',
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
        <textarea
          ref={ref}
          className={cn(
            'w-full resize-none rounded-lg border bg-bg p-3 placeholder-subtext/60',
            'focus:border-border focus:outline-none focus:ring-1 focus:ring-border',
            textareaClassName,
          )}
          {...props}
        />
        {error && (
          <p className={cn('mt-2 font-semibold text-red-400', errorClassName)}>
            {error}
          </p>
        )}
      </div>
    );
  },
);

CustomTextarea.displayName = 'CustomTextarea';

export { CustomTextarea };
