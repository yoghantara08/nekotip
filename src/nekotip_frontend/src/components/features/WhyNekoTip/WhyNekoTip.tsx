import React, { ReactNode } from 'react';

import { Gift, Shield, Users, Zap } from 'lucide-react';

const WhyNekoTip = () => {
  return (
    <div className="my-10 mt-6 flex w-full justify-center md:mt-10">
      <section className="w-full max-w-[1280px] px-4 py-7 md:py-12">
        <h1 className="mb-6 text-center text-2xl font-bold text-title md:mb-12 lg:text-3xl">
          Why Choose NekoTip?
        </h1>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<Shield className="h-10 w-10 text-pink-400" />}
            title="Secure Blockchain Technology"
            description="Built on the Internet Computer Protocol (ICP) for unparalleled security and transparency."
          />
          <FeatureCard
            icon={<Zap className="h-10 w-10 text-pink-400" />}
            title="Seamless Transactions"
            description="Easy donations and content unlocking with ICP tokens."
          />
          <FeatureCard
            icon={<Gift className="h-10 w-10 text-pink-400" />}
            title="Exclusive Content"
            description="Access unique content from your favorite creators."
          />
          <FeatureCard
            icon={<Users className="h-10 w-10 text-pink-400" />}
            title="Rewarding Referrals"
            description="Earn rewards by referring friends to the platform."
          />
        </div>
      </section>
    </div>
  );
};

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="rounded-lg border bg-mainAccent/20 p-6 shadow-custom">
      <div className="mb-4">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold text-title">{title}</h3>
      <p className="font-medium text-subtext">{description}</p>
    </div>
  );
}

export default WhyNekoTip;
