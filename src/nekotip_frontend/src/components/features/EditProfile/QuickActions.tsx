import React from 'react';
import { Link } from 'react-router-dom';

import Button from '@/components/ui/Button/Button';

const QuickActions = () => {
  const quickActions = [
    {
      title: 'Post Exclusive Content',
      to: '/dashboard/content-management',
    },
    {
      title: 'Withdraw Earnings',
      to: '/dashboard/wallet',
    },
    {
      title: 'Refer a Friend',
      to: '/dashboard/referrals',
    },
  ];

  return (
    <div className="flex h-fit flex-col gap-4 rounded-lg border border-border px-5 pb-6 pt-4 shadow-custom">
      <h3 className="text-lg font-semibold text-subtext">Quick Actions</h3>
      {quickActions.map((action) => (
        <Link key={action.title} to={action.to} className="w-full">
          <Button
            variant="third"
            className="w-full border-border"
            shadow={false}
          >
            {action.title}
          </Button>
        </Link>
      ))}
    </div>
  );
};

export default QuickActions;
