import React from 'react';
import { Link } from 'react-router-dom';

import { cn } from '@/lib/utils/cn';
import { useAuthManager } from '@/store/AuthProvider';

import Button from '../../Button/Button';

import UserDropdown from './UserDropdown';

const Navbar = () => {
  const { isAuthenticated, login } = useAuthManager();

  return (
    <nav className="flex w-full justify-center border-b">
      <div
        className={cn('flex h-[80px] w-full items-center justify-between px-6')}
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
              <Link to="/creator">Explore Creator</Link>
            </li>
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
