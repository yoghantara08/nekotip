import React from 'react';

import EditProfile from '@/components/features/EditProfile/EditProfile';
import LayoutDashboard from '@/components/ui/Layout/LayoutDashboard';

const ProfilePage = () => {
  return (
    <LayoutDashboard title={'Profile'}>
      <h1 className="text-title text-2xl font-semibold lg:text-3xl">
        Edit Profile
      </h1>
      <EditProfile />
    </LayoutDashboard>
  );
};

export default ProfilePage;
