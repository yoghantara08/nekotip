import React from 'react';
import { Link } from 'react-router-dom';

import useAuth from '@/hooks/useAuth';

import Button from '../../Button/Button';

import UserDropdown from './UserDropdown';

const Navbar = () => {
  const { isAuthenticated, handleLogin } = useAuth();

  return (
    <nav className="flex w-full justify-center border-b px-4">
      <div className="flex h-[100px] w-full max-w-[1280px] items-center justify-between">
        <div className="flex items-center gap-x-[60px]">
          <img
            alt="nekotip logo"
            src="/images/logo/nekotip-logo.svg"
            loading="eager"
          ></img>
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
          <Button onClick={handleLogin}>Login</Button>
        ) : (
          <UserDropdown />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
