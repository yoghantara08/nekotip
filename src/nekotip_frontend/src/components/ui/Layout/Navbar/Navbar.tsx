import React from 'react';
import { Link } from 'react-router-dom';

import { useAuthManager } from '@/hooks/useAuthManager';
import { cn } from '@/lib/utils/cn';

import Button from '../../Button/Button';

import UserDropdown from './UserDropdown';

const Navbar = ({ dashboard }: { dashboard: boolean }) => {
  const { isAuthenticated, login } = useAuthManager();

  return (
    <nav className="flex w-full justify-center border-b">
      <div
        className={cn(
          'flex h-[80px] w-full items-center justify-between px-4',
          dashboard ? 'px-6' : 'max-w-[1280px]',
        )}
      >
        <div className="flex items-center gap-x-[60px]">
          <Link to={'/'}>
            <img
              alt="nekotip logo"
              src="/images/logo/nekotip-logo.svg"
              loading="eager"
            ></img>
          </Link>
          <ul className="flex items-center gap-x-10 font-semibold text-subtext">
            {isAuthenticated && (
              <li className="hover:text-black">
                <Link to="/dashboard">Dashboard</Link>
              </li>
            )}
            <li className="hover:text-black">
              <Link to="/explore">Explore Creator</Link>
            </li>
            <li className="cursor-pointer hover:text-black">Support</li>
          </ul>
        </div>

        {!isAuthenticated ? (
          <Button onClick={login}>Login</Button>
        ) : (
          <UserDropdown />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
