import React from 'react';

import Button from '@/components/ui/Button/Button';
import useUser from '@/hooks/useUser';
import useWindowSize from '@/hooks/useWindowSize';

const ChangeBannerProfile = () => {
  const { user } = useUser();
  const { isMobile } = useWindowSize();

  return (
    <div className="flex flex-col gap-2 md:gap-4">
      <h3 className="font-semibold text-subtext md:text-lg">Banner Picture</h3>
      <div className="flex h-24 w-full items-center justify-center overflow-hidden rounded-lg border md:h-32 md:min-w-[450px]">
        <img
          src={user?.bannerPic ?? '/images/default-banner.png'}
          alt="profile"
          className="h-auto w-full object-cover"
        />
      </div>
      <Button
        size={isMobile ? 'small' : 'default'}
        className="w-fit xxl:mt-2 xxl:w-full"
        shadow={false}
      >
        Upload Banner Picture
      </Button>
    </div>
  );
};

export default ChangeBannerProfile;
