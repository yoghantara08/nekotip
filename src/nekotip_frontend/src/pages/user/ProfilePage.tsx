import React from 'react';

import LayoutDashboard from '@/components/ui/Layout/LayoutDashboard';
import useUser from '@/hooks/useUser';

const ProfilePage = () => {
  const { user } = useUser();

  return (
    <LayoutDashboard title={'Profile'}>
      <p>{user?.username}</p>
      {/* <p>{user?.depositAddress}</p> */}
    </LayoutDashboard>
  );
};

export default ProfilePage;
