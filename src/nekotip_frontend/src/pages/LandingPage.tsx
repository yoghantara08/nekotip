import React from 'react';

import FAQ from '@/components/features/FAQ/FAQ';
import HeroBanner from '@/components/features/HeroBanner/HeroBanner';
import WhyNekoTip from '@/components/features/WhyNekoTip/WhyNekoTip';
import Layout from '@/components/ui/Layout/Layout';

const LandingPage = () => {
  return (
    <Layout fullWidth className="px-0">
      <HeroBanner />
      <WhyNekoTip />
      <FAQ />
    </Layout>
  );
};

export default LandingPage;
