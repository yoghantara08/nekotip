import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { User2Icon } from 'lucide-react';

import useAuth from '@/hooks/useAuth';
import useUser from '@/hooks/useUser';
import { cn } from '@/lib/utils/cn';

import Button from '../../Button/Button';
import Drawer from '../../Drawer/Drawer';

import { menuSections } from './UserDropdown';

const MobileNavbar = () => {
  const { isAuthenticated, handleLogin, logoutUser } = useAuth();
  const { user } = useUser();

  const [openMenu, setOpenMenu] = useState(false);

  const regularSections = menuSections.slice(0, -1);
  const logoutSection = menuSections[menuSections.length - 1];

  return (
    <nav className="flex h-[75px] items-center justify-between border-b px-4">
      <img
        alt="nekotip logo"
        src="/images/logo/nekotip-logo.svg"
        loading="eager"
        className="w-32"
      ></img>

      <div className="flex items-center gap-2">
        {isAuthenticated ? (
          <div
            onClick={() => setOpenMenu(true)}
            className="flex size-11 items-center justify-center overflow-hidden rounded-full bg-mainAccent text-subtext"
          >
            {user?.profilePic ? (
              <img src={user.profilePic} alt="nekotip" />
            ) : (
              <User2Icon />
            )}
          </div>
        ) : (
          <Button onClick={handleLogin} size="small">
            Login
          </Button>
        )}
      </div>

      <Drawer isOpen={openMenu} onClose={() => setOpenMenu(false)} size="xl">
        <div className="flex h-full flex-col">
          {/* Main menu sections */}
          <div className="flex-1 overflow-y-auto">
            <div className={cn('space-y-3 p-3 py-4', 'divide-[#3E3D39]')}>
              {regularSections.map((section, sectionIndex) => (
                <div
                  key={sectionIndex}
                  className="overflow-hidden rounded-lg bg-mainAccent"
                >
                  {section.items.map((item, itemIndex) => (
                    <Link
                      key={itemIndex}
                      to={item.to ?? ''}
                      onClick={() => setOpenMenu(false)}
                      className={cn(
                        'block w-full px-4 py-3 text-base font-medium text-subtext',
                        'transition-colors duration-150',

                        'border-b border-[#3E3D39]/10 last:border-0',
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Logout section */}
          <div className="mt-auto border-t border-border/30">
            {logoutSection.items.map((item, itemIndex) => (
              <div
                key={itemIndex}
                onClick={() => {
                  logoutUser();
                  setOpenMenu(false);
                }}
                className={cn(
                  'block w-full bg-mainAccent/50 px-4 py-4 text-base font-medium text-subtext',
                )}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </Drawer>
    </nav>
  );
};

export default MobileNavbar;
