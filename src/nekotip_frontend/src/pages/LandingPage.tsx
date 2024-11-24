import React from 'react';

import FAQ from '@/components/features/FAQ/FAQ';
import HeroBanner from '@/components/features/HeroBanner/HeroBanner';
import Layout from '@/components/ui/Layout/Layout';

const LandingPage = () => {
  return (
    <Layout fullWidth className="px-0">
      <HeroBanner />
      <FAQ />
    </Layout>
  );
};

export default LandingPage;
