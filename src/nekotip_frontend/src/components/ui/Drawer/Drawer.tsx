import React from 'react';

import {
  Dialog,
  DialogBackdrop,
  Transition,
  TransitionChild,
} from '@headlessui/react';

import { cn } from '@/lib/utils/cn';

type PositionType = 'right' | 'left' | 'top' | 'bottom';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position?: PositionType;
  overlay?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  containerClassName?: string;
}

const Drawer = ({
  isOpen,
  onClose,
  children,
  containerClassName,
  position = 'bottom',
  overlay = true,
  size = 'md',
}: DrawerProps) => {
  // Position-based classes
  const positionClasses = {
    right: 'right-0 h-full bottom-0',
    left: 'left-0 h-full bottom-0 border-r border-l-0 rounded-r-lg',
    top: 'top-0 w-full',
    bottom: 'bottom-0 w-full border-t rounded-t-xl',
  };

  // Size classes for width/height based on position
  const sizeClasses = {
    right: {
      sm: 'w-64',
      md: 'w-80',
      lg: 'w-96',
      xl: 'w-1/2',
      full: 'w-full',
    },
    left: {
      sm: 'w-64',
      md: 'w-80',
      lg: 'w-96',
      xl: 'w-1/2',
      full: 'w-full',
    },
    top: {
      sm: 'h-1/4',
      md: 'h-1/3',
      lg: 'h-1/2',
      xl: 'h-2/3',
      full: 'h-full',
    },
    bottom: {
      sm: 'h-1/4',
      md: 'h-1/3',
      lg: 'h-1/2',
      xl: 'h-2/3',
      full: 'h-full',
    },
  };

  // Slide animation classes
  const slideDirections = {
    right: 'translate-x-full',
    left: '-translate-x-full',
    top: '-translate-y-full',
    bottom: 'translate-y-full',
  };

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog
        as="div"
        className="relative inset-0 z-50 overflow-hidden"
        onClose={onClose}
      >
        <div className="absolute inset-0 overflow-hidden">
          <TransitionChild
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            {overlay && (
              <DialogBackdrop
                onClick={onClose}
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              />
            )}
          </TransitionChild>

          <TransitionChild
            as={React.Fragment}
            enter="transform transition ease-out duration-300"
            enterFrom={slideDirections[position]}
            enterTo="translate-x-0 translate-y-0"
            leave="transform transition ease-in duration-200"
            leaveFrom="translate-x-0 translate-y-0"
            leaveTo={slideDirections[position]}
          >
            <div
              className={cn(
                'fixed bg-bg',
                positionClasses[position],
                sizeClasses[position][size],
                containerClassName,
              )}
            >
              <main className="h-full overflow-y-auto">{children}</main>
            </div>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Drawer;
