import { Fragment } from 'react';
import { Link } from 'react-router-dom';

import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from '@headlessui/react';
import {
  ChevronDown,
  CircleUserRoundIcon,
  CompassIcon,
  EarthIcon,
  HeartIcon,
  PaletteIcon,
  ShoppingBagIcon,
  SquareUserIcon,
  UserRoundPlusIcon,
  UsersIcon,
  UsersRoundIcon,
  WalletIcon,
} from 'lucide-react';

import useUser from '@/hooks/useUser';
import { cn } from '@/lib/utils/cn';
import { useAuthManager } from '@/store/AuthProvider';

export const menuSections = [
  {
    items: [
      { label: 'Profile', to: '/dashboard', icon: <CircleUserRoundIcon /> },
      { label: 'Wallet', to: '/dashboard/wallet', icon: <WalletIcon /> },
      {
        label: 'Creator Studio',
        to: '/dashboard/creator-studio',
        icon: <PaletteIcon />,
      },
    ],
    activeClassName: 'hover:bg-mainAccent',
  },
  {
    items: [
      {
        label: 'Purchased Content',
        to: '/dashboard/purchased-content',
        icon: <ShoppingBagIcon />,
      },
      { label: 'Explore Creator', to: '/creator', icon: <EarthIcon /> },
      { label: 'Discover', to: '/dashboard/discover', icon: <CompassIcon /> },
    ],
    activeClassName: 'hover:bg-secondaryAccent',
  },
  {
    items: [
      {
        label: 'Support Given',
        to: '/dashboard/support-given',
        icon: <HeartIcon />,
      },
      {
        label: 'Followed Creators',
        to: '/dashboard/following',
        icon: <SquareUserIcon />,
      },
    ],
    activeClassName: 'hover:bg-thirdAccent',
  },
  {
    items: [
      {
        label: 'My Supporter',
        to: '/dashboard/supporter',
        icon: <UsersIcon />,
      },
      {
        label: 'My Followers',
        to: '/dashboard/followers',
        icon: <UsersRoundIcon />,
      },
      {
        label: 'My Referrals',
        to: '/dashboard/referrals',
        icon: <UserRoundPlusIcon />,
      },
    ],
    activeClassName: 'hover:bg-mainAccent',
  },
  {
    items: [{ label: 'Logout', to: undefined, icon: undefined }],
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
        <div
          className={cn(
            'flex size-12 items-center justify-center overflow-hidden rounded-full text-subtext',
            !user?.profilePic && 'bg-mainAccent',
          )}
        >
          <img
            src={user?.profilePic || '/images/user-default.svg'}
            alt="profilepic"
            className={cn(user?.profilePic && 'h-full w-full object-cover')}
          />
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
            'absolute right-0 z-50 mt-3 w-60 origin-top-right divide-y rounded-lg shadow-lg ring-1',
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
                        'flex items-center gap-1.5 px-4 py-2 text-sm text-subtext hover:text-white',
                        section.activeClassName,
                      )}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ) : (
                    <div
                      onClick={logout}
                      className={cn(
                        'block cursor-pointer px-4 py-2 text-center text-sm text-subtext hover:text-white',
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
