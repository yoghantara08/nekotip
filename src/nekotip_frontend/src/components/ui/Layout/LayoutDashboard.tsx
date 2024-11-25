import { Helmet } from 'react-helmet';

import useWindowSize from '@/hooks/useWindowSize';
import { cn } from '@/lib/utils/cn';

import MobileNavbar from './Navbar/MobileNavbar';
import Navbar from './Navbar/Navbar';
import { LayoutProps } from './types';

const LayoutDashboard = ({ children, className, title }: LayoutProps) => {
  const { isMobile } = useWindowSize();

  let pageTitle: string = 'NekoTip';
  if (title) {
    pageTitle = title + ' - NekoTip';
  }
  return (
    <>
      <Helmet title={pageTitle}></Helmet>
      <div className="h-full w-full">
        {isMobile ? <MobileNavbar /> : <Navbar dashboard />}
        <main className={cn('w-full px-6', className)}>{children}</main>
      </div>
    </>
  );
};

export default LayoutDashboard;
