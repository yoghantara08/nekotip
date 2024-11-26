import React from 'react';

import Button from '@/components/ui/Button/Button';
import useUser from '@/hooks/useUser';

const ChangeBannerProfile = () => {
  const { user } = useUser();

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-subtext">Banner Picture</h3>
      <div className="flex h-32 w-[450px] items-center justify-center overflow-hidden rounded-lg border border-border">
        <img
          src={user?.bannerPic ?? '/images/default-banner.png'}
          alt="profile"
          className="h-auto w-full"
        />
      </div>
      <Button className="mt-2" shadow={false}>
        Upload Banner Picture
      </Button>
    </div>
  );
};

export default ChangeBannerProfile;
