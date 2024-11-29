import React from 'react';

const HowItWorks = () => {
  return (
    <section className="bg-mainAccent/20 py-20 md:py-24">
      <div className="container mx-auto px-4">
        <h1 className="mb-6 text-center text-2xl font-bold text-title md:mb-12 lg:text-3xl">
          How NekoTip Works
        </h1>
        <div className="grid grid-cols-1 gap-8 text-subtext md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-mainAccent">
              <span className="text-2xl font-bold text-pink-500">1</span>
            </div>
            <h3 className="mb-2 text-xl font-semibold">Sign Up</h3>
            <p className="font-medium">
              Create your account using Internet Identity for secure, seamless
              access.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-mainAccent">
              <span className="text-2xl font-bold text-pink-500">2</span>
            </div>
            <h3 className="mb-2 text-xl font-semibold">Connect</h3>
            <p className="font-medium">
              Follow your favorite creators and discover exciting new content.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-mainAccent">
              <span className="text-2xl font-bold text-pink-500">3</span>
            </div>
            <h3 className="mb-2 text-xl font-semibold">Support & Enjoy</h3>
            <p className="font-medium">
              Donate, unlock exclusive content, and earn rewards through
              referrals.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
