import React from 'react';

import Layout from '@/components/ui/Layout/Layout';
import useUser from '@/hooks/useUser';

const ManageProfilePage = () => {
  const { user } = useUser();

  return (
    <Layout title={'Profile'}>
      <p>{user?.username}</p>
      <p>{user?.depositAddress}</p>
    </Layout>
  );
};

export default ManageProfilePage;
