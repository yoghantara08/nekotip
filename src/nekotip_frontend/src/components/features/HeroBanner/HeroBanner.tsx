import React from 'react';
import { Link } from 'react-router-dom';

import Button from '@/components/ui/Button/Button';
import { useAuthManager } from '@/hooks/useAuthManager';
import useWindowSize from '@/hooks/useWindowSize';

const HeroBanner = () => {
  const { login } = useAuthManager();
  const { isMobile } = useWindowSize();

  return (
    <div className="flex w-full justify-center border-b">
      <section className="relative w-full max-w-[1280px] px-4 pb-8 sm:pb-12 md:pb-36 md:pt-10">
        <p className="mb-4 text-center font-montserrat text-sm font-medium text-subtext md:mb-5 md:text-xl">
          A secure way to connect and support
        </p>
        <div className="flex flex-col items-center text-center text-4xl font-semibold sm:text-5xl md:text-7xl">
          <div className="flex items-center gap-3 md:gap-5">
            <h1>Empower</h1>
            <img
              src="/images/logo/nekotip.svg"
              alt="nekotip"
              className="w-[60px] sm:w-[75px] md:w-[110px]"
            />
            <h1>your</h1>
          </div>
          <h1>favorite creators</h1>
        </div>

        <div className="mt-5 flex items-center justify-center gap-10 md:mt-9">
          <Button
            size={isMobile ? 'small' : 'default'}
            className="md:w-[250px]"
            onClick={login}
          >
            Join Now
          </Button>

          <Link to="/explore">
            <Button
              size={isMobile ? 'small' : 'default'}
              variant={'secondary'}
              className="md:w-[250px]"
            >
              Explore NekoTip
            </Button>
          </Link>
        </div>

        {/* FLOATING ICONS */}
        <img
          src="/images/star-left.svg"
          alt="star"
          className="absolute left-12 top-6 hidden w-20 justify-center md:flex lg:left-24 lg:top-10"
        />
        <img
          src="/images/hexagon-left.svg"
          alt="star"
          className="absolute bottom-10 left-24 hidden w-20 justify-center md:flex lg:bottom-10 lg:left-48"
        />
        <img
          src="/images/hexagon-right.svg"
          alt="star"
          className="absolute right-12 top-6 hidden w-20 justify-center md:flex lg:right-28 lg:top-10"
        />
        <img
          src="/images/star-right.svg"
          alt="star"
          className="absolute bottom-10 right-24 hidden w-20 justify-center md:flex lg:bottom-10 lg:right-48"
        />
      </section>
    </div>
  );
};

export default HeroBanner;
