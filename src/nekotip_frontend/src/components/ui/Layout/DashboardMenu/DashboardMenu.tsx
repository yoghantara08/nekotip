import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import { cn } from '@/lib/utils/cn';
import { useAuthManager } from '@/store/AuthProvider';

import Button from '../../Button/Button';
import { menuSections } from '../Navbar/UserDropdown';

const DashboardMenu = () => {
  const { pathname } = useLocation();
  const { logout } = useAuthManager();

  const dashboardMenu = menuSections.slice(0, -1);

  return (
    <aside className="h-[calc(100vh-81px)] min-w-[220px] border-r border-border">
      <div className="flex flex-col divide-y divide-border">
        {dashboardMenu.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-1 p-2">
            {section.items.map((item, itemIndex) => (
              <Link
                key={itemIndex}
                to={item.to ?? '#'}
                className={cn(
                  'flex w-full items-center gap-2 rounded-xl px-4 py-3 text-base font-medium text-subtext',
                  item.to === pathname &&
                    [
                      'bg-mainAccent',
                      'bg-secondaryAccent',
                      'bg-thirdAccent',
                      'bg-mainAccent',
                    ][sectionIndex],
                  section.activeClassName,
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-5 border-t border-border px-3 pt-6">
        <Button className="w-full px-0 shadow-none" onClick={logout}>
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default DashboardMenu;
