import React from 'react';

import HeroBanner from '@/components/features/HeroBanner/HeroBanner';
import Layout from '@/components/ui/Layout/Layout';

const LandingPage = () => {
  return (
    <Layout fullWidth className="px-0">
      <HeroBanner />
    </Layout>
  );
};

export default LandingPage;
