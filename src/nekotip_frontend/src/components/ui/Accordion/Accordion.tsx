import { ReactNode } from 'react';

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils/cn';

export interface AccordionItem {
  title: string;
  content: ReactNode;
  icon?: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
  variant?: 'default';
}

const Accordion = ({
  items,
  className,
  variant = 'default',
}: AccordionProps) => {
  const getVariantStyles = (isActive: boolean) => {
    const variants = {
      default: {
        button: cn(
          'flex w-full items-center justify-between rounded-lg px-5 py-3 text-left h-[60px]',
          'bg-mainAccent text-subtext hover:bg-mainAccent/90 ',
          isActive && 'bg-mainAccent/90 rounded-b-none ',
        ),
        panel: 'bg-bg rounded-b-lg px-4 py-3 text-subtext ',
        wrapper: 'mb-3 rounded-lg border border-border/20 shadow-custom',
      },
    };
    return variants[variant];
  };

  return (
    <div className={cn('w-full', className)}>
      {items.map((item, index) => (
        <Disclosure key={index}>
          {({ open }) => {
            const styles = getVariantStyles(open);
            return (
              <div className={styles.wrapper}>
                <DisclosureButton className={styles.button}>
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span className="font-medium">{item.title}</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 text-subtext transition-transform duration-200',
                      open && 'rotate-180',
                    )}
                  />
                </DisclosureButton>

                <DisclosurePanel className={styles.panel}>
                  {item.content}
                </DisclosurePanel>
              </div>
            );
          }}
        </Disclosure>
      ))}
    </div>
  );
};

export default Accordion;
