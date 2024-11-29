import React, { useEffect, useState } from 'react';

import SupporterCard from '@/components/features/MySupporter/SupporterCard';
import LayoutDashboard from '@/components/ui/Layout/LayoutDashboard';
import { cn } from '@/lib/utils/cn';
import { useAuthManager } from '@/store/AuthProvider';

import { Transaction } from '../../../../../declarations/nekotip_backend/nekotip_backend.did';

const MySupporterPage = () => {
  const { actor, principal } = useAuthManager();

  const [supporters, setSupporters] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSupporters = async () => {
      try {
        setIsLoading(true);
        if (!actor || !principal) return;
        const result = await actor.getReceivedDonations(principal);

        if (result && supporters.length === 0) {
          setSupporters(result);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSupporters();
  }, [actor, principal, supporters.length]);

  return (
    <LayoutDashboard title="Supporter" className="w-full">
      <h1 className="text-2xl font-semibold text-title lg:text-3xl">
        My Supporter
      </h1>
      <div
        className={cn(
          'mt-3 min-h-28 w-full rounded-lg border p-5 font-medium text-subtext shadow-custom',
          supporters.length === 0 &&
            'flex min-h-[200px] max-w-[600px] items-center justify-center md:min-h-[300px]',
        )}
      >
        {isLoading ? (
          <span className="text-lg">Loading...</span>
        ) : supporters.length === 0 ? (
          <span className="text-lg">You don't have any supporter yet</span>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xxl:grid-cols-4">
            {supporters.map((support) => (
              <SupporterCard key={support.id} supporter={support} />
            ))}
          </div>
        )}
      </div>
    </LayoutDashboard>
  );
};

export default MySupporterPage;
