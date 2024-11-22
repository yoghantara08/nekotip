import { Fragment } from 'react';
import { Link } from 'react-router-dom';

import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from '@headlessui/react';
import { ChevronDown, User2Icon } from 'lucide-react';

import { useAuthManager } from '@/hooks/useAuthManager';
import useUser from '@/hooks/useUser';
import { cn } from '@/lib/utils/cn';

export const menuSections = [
  {
    items: [
      { label: 'Profile', to: '/dashboard' },
      { label: 'Wallet', to: '/dashboard/wallet' },
      { label: 'Post Management', to: '/dashboard/content-management' },
    ],
    activeClassName: 'hover:bg-mainAccent',
  },
  {
    items: [
      { label: 'Exclusive Content', to: '/dashboard/exclusive-content' },
      { label: 'Explore Creator', to: '/explore' },
      { label: 'Discover', to: '/dashboard/discover' },
    ],
    activeClassName: 'hover:bg-secondaryAccent',
  },
  {
    items: [
      { label: 'Support Given', to: '/dashboard/support-given' },
      { label: 'Followed Creators', to: '/dashboard/following' },
    ],
    activeClassName: 'hover:bg-thirdAccent',
  },
  {
    items: [
      { label: 'My Supporter', to: '/dashboard/supporter' },
      { label: 'My Followers', to: '/dashboard/followers' },
      { label: 'My Referrals', to: '/dashboard/referrals' },
    ],
    activeClassName: 'hover:bg-mainAccent',
  },
  {
    items: [{ label: 'Logout', to: undefined }],
    activeClassName: 'hover:bg-shadow',
  },
];

const UserDropdown = () => {
  const { user } = useUser();
  const { logout } = useAuthManager();

  return (
    <Menu as="div" className="mt2 relative inline-block text-left">
      {/* Dropdown Button */}
      <MenuButton className={'flex items-center gap-3'}>
        <div className="flex size-12 items-center justify-center overflow-hidden rounded-full bg-mainAccent text-subtext">
          {user?.profilePic ? (
            <img src={user.profilePic} alt="nekotip" />
          ) : (
            <User2Icon className="size-7" />
          )}
        </div>
        <div className="flex items-center gap-1 text-subtext">
          <div className="font-semibold">@{user?.username}</div>
          <ChevronDown />
        </div>
      </MenuButton>

      {/* Dropdown Items */}
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-150"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems
          className={cn(
            'absolute right-0 z-50 mt-3 w-56 origin-top-right divide-y rounded-lg shadow-lg ring-1',
            'divide-[#3E3D39] border-caption bg-[#FFE4E1] ring-caption',
          )}
        >
          {menuSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="py-1 font-medium">
              {section.items.map((item, itemIndex) => (
                <MenuItem key={itemIndex}>
                  {item.to ? (
                    <Link
                      to={item.to}
                      className={cn(
                        'block px-4 py-2 text-sm text-subtext hover:text-white',
                        section.activeClassName,
                      )}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <div
                      onClick={logout}
                      className={cn(
                        'block cursor-pointer px-4 py-2 text-sm text-subtext hover:text-white',
                        section.activeClassName,
                      )}
                    >
                      {item.label}
                    </div>
                  )}
                </MenuItem>
              ))}
            </div>
          ))}
        </MenuItems>
      </Transition>
    </Menu>
  );
};

export default UserDropdown;
