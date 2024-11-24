import React from 'react';

const Footer = () => {
  const socials = [
    { link: '#', icon: '/images/icons/instagram.svg' },
    { link: '#', icon: '/images/icons/twitter.svg' },
    { link: '#', icon: '/images/icons/facebook.svg' },
  ];

  return (
    <footer className="flex h-[60px] w-full items-center justify-center border-t md:h-[75px]">
      <div className="flex w-full max-w-[1280px] items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {/* <p className="text-xl font-semibold text-subtext">©2024</p> */}
          <img
            src="/images/logo/nekotip-logo.svg"
            alt="nekotip logo"
            className="w-24 md:w-28"
          />
        </div>
        <div className="flex items-center gap-8">
          {socials.map((social, index) => (
            <a
              href={social.link}
              key={index}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                key={index}
                src={social.icon}
                alt="social icon"
                className="w-6 cursor-pointer hover:opacity-70 md:w-7"
              />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
