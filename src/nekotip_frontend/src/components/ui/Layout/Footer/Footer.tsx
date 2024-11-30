import { Link } from 'react-router-dom';

const Footer = () => {
  const footerLinks = [
    {
      title: 'Quick Links',
      links: [
        { name: 'About Us', to: '#' },
        { name: 'Explore Creator', to: '/creator' },
        { name: 'Discover', to: '/dashboard/discover' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Terms of Service', to: '#' },
        { name: 'Privacy Policy', to: '#' },
        { name: 'Cookie Policy', to: '#' },
      ],
    },
    {
      title: 'Connect',
      links: [
        { name: 'Twitter', to: '#' },
        { name: 'Facebook', to: '#' },
        { name: 'Instagram', to: '#' },
        { name: 'Telegram', to: '#' },
      ],
    },
  ];

  return (
    <footer className="w-full border-t bg-mainAccent py-8 font-medium text-subtext">
      <section className="flex flex-col gap-6 px-4 md:gap-14 xl:flex-row xl:justify-center xl:gap-20">
        <div className="w-[350px]">
          <img
            src="/images/logo/nekotip-logo.svg"
            alt="nekotip logo"
            className="mb-2 w-28 md:w-40"
          />
          <p className="max-w-[350px] font-medium">
            Connecting fans and creators through secure blockchain technology.
          </p>
        </div>

        <div className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
          {footerLinks.map((footer) => (
            <div key={footer.title} className="grid w-[300px] xl:justify-end">
              <h3 className="mb-2 text-lg font-semibold text-title">
                {footer.title}
              </h3>
              <ul className="space-y-1 font-medium text-caption">
                {footer.links.map((item) => (
                  <li key={item.name}>
                    <Link to={item.to} className="hover:text-title">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 border-t pt-8 text-center">
        <p>&copy; 2024 NekoTip. All rights reserved.</p>
      </section>
    </footer>
  );
};

export default Footer;
