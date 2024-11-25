import React, { Fragment, ReactNode } from 'react';

import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { CircleXIcon } from 'lucide-react';

import { cn } from '@/lib/utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  className?: string;
}

const ModalCustom: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  className,
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className={'relative z-50'} onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className={cn('fixed inset-0 bg-bg/10 backdrop-blur-[2px]')} />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full w-full items-center justify-center text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-50"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-50"
            >
              <DialogPanel
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  'mx-[15px] my-4 w-full transform overflow-hidden rounded-2xl transition-all',
                  'bg-cardBackground border border-border/60 shadow-custom',
                  className,
                )}
              >
                {title ? (
                  <div
                    className={cn(
                      'flex h-[60px] items-center justify-between border-b border-border/60 px-6 md:h-[72px]',
                    )}
                  >
                    <div className="text-base font-semibold md:text-2xl">
                      {title}
                    </div>

                    <CircleXIcon
                      className="h-6 w-6 cursor-pointer stroke-[1.5px] text-subtext hover:text-black md:h-7 md:w-7"
                      onClick={onClose}
                    />
                  </div>
                ) : (
                  <CircleXIcon
                    className={cn(
                      'absolute right-5 top-5 z-20 h-6 w-6 cursor-pointer text-subtext hover:text-black',
                      'md:h-7 md:w-7',
                    )}
                    onClick={onClose}
                  />
                )}
                <div className="bg-bg">{children}</div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalCustom;
