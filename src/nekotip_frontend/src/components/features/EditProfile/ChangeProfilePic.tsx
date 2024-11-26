import React from 'react';

import Button from '@/components/ui/Button/Button';
import useUser from '@/hooks/useUser';
import useWindowSize from '@/hooks/useWindowSize';

const ChangeProfilePic = () => {
  const { user } = useUser();
  const { isMobile } = useWindowSize();

  return (
    <div className="flex flex-col gap-2 md:gap-4">
      <h3 className="font-semibold text-subtext md:text-lg">Profile Picture</h3>
      <div className="flex size-20 items-center justify-center overflow-hidden rounded-full border border-border md:size-32">
        <img
          src={user?.profilePic ?? '/images/logo/nekotip.svg'}
          alt="profile"
          className="h-full w-full object-cover"
        />
      </div>
      <Button
        className="w-fit xxl:mt-2 xxl:w-full"
        shadow={false}
        size={isMobile ? 'small' : 'default'}
      >
        Upload New Picture
      </Button>
    </div>
  );
};

export default ChangeProfilePic;
