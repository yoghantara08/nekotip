import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t bg-mainAccent py-8 font-medium text-subtext">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <img
              src="/images/logo/nekotip-logo.svg"
              alt="nekotip logo"
              className="mb-2 w-28 md:w-40"
            />
            <p className="">
              Connecting fans and creators through secure blockchain technology.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="hover:text-black">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/creator" className="hover:text-black">
                  Explore Creator
                </Link>
              </li>
              <li>
                <Link to="/dashboard/discover" className="hover:text-black">
                  Discover
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-lg font-semibold">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="hover:text-black">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-black">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-black">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-lg font-semibold">Connect</h4>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="hover:text-black">
                  Twitter
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-black">
                  Facebook
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-black">
                  Instagram
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-black">
                  Telegram
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center">
          <p>&copy; 2024 NekoTip. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
