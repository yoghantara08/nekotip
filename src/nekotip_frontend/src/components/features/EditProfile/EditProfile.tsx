import React from 'react';

import ChangeBannerProfile from './ChangeBannerProfile';
import ChangeProfilePic from './ChangeProfilePic';
import QuickActions from './QuickActions';

const EditProfile = () => {
  return (
    <div className="mt-3 flex gap-6">
      <div className="rounded-lg border border-border px-5 py-4 shadow-custom">
        <div className="flex items-center gap-10">
          <ChangeProfilePic />
          <ChangeBannerProfile />
        </div>
        {/* <UpdateProfileForm /> */}
      </div>
      <QuickActions />
    </div>
  );
};

export default EditProfile;
