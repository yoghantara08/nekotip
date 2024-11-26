import { Helmet } from 'react-helmet';

import useWindowSize from '@/hooks/useWindowSize';
import { cn } from '@/lib/utils/cn';

import DashboardMenu from './DashboardMenu/DashboardMenu';
import MobileNavbar from './Navbar/MobileNavbar';
import Navbar from './Navbar/Navbar';
import { LayoutProps } from './types';

const LayoutDashboard = ({ children, className, title }: LayoutProps) => {
  const { isTablet } = useWindowSize();

  let pageTitle: string = 'NekoTip';
  if (title) {
    pageTitle = title + ' - NekoTip';
  }
  return (
    <>
      <Helmet title={pageTitle}></Helmet>
      <div className="h-full w-full">
        {isTablet ? <MobileNavbar /> : <Navbar />}
        <div className={cn('flex h-full w-full', className)}>
          {!isTablet && <DashboardMenu />}
          <main className="mb-4 p-4 lg:p-7">{children}</main>
        </div>
      </div>
    </>
  );
};

export default LayoutDashboard;
