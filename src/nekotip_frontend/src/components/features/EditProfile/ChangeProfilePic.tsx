import React from 'react';

import Button from '@/components/ui/Button/Button';
import useUser from '@/hooks/useUser';

const ChangeProfilePic = () => {
  const { user } = useUser();

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-subtext">Profile Picture</h3>
      <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-border">
        <img
          src={user?.profilePic ?? '/images/logo/nekotip.svg'}
          alt="profile"
          className="h-full w-full object-cover"
        />
      </div>
      <Button className="mt-2" shadow={false}>
        Upload New Picture
      </Button>
    </div>
  );
};

export default ChangeProfilePic;
