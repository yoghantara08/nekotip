import React from 'react';

import EditProfile from '@/components/features/EditProfile/EditProfile';
import LayoutDashboard from '@/components/ui/Layout/LayoutDashboard';

const ProfilePage = () => {
  return (
    <LayoutDashboard title={'Profile'}>
      <h1 className="text-title text-3xl font-semibold">Edit Profile</h1>
      <EditProfile />
    </LayoutDashboard>
  );
};

export default ProfilePage;
