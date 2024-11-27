import React from 'react';

import ContentManagement from '@/components/features/ContentManagement/ContentManagement';
import LayoutDashboard from '@/components/ui/Layout/LayoutDashboard';

const CreatorStudioPage = () => {
  return (
    <LayoutDashboard title="Creator Studio" className="w-full">
      <ContentManagement />
    </LayoutDashboard>
  );
};

export default CreatorStudioPage;
