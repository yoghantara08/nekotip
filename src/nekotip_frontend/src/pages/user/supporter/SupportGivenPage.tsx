import React, { useEffect, useState } from 'react';

import SupportGivenCard from '@/components/features/SupportGiven/SupportGivenCard';
import LayoutDashboard from '@/components/ui/Layout/LayoutDashboard';
import { cn } from '@/lib/utils/cn';
import { useAuthManager } from '@/store/AuthProvider';

import { Transaction } from '../../../../../declarations/nekotip_backend/nekotip_backend.did';

const SupportGivenPage = () => {
  const { actor } = useAuthManager();

  const [supported, setSupported] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSupportGiven = async () => {
      try {
        setIsLoading(true);
        if (!actor) return;
        const result = await actor.getGivenDonations();

        if (result && supported.length === 0) {
          setSupported(result);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSupportGiven();
  }, [actor, supported.length]);

  return (
    <LayoutDashboard title="Supporter" className="w-full">
      <h1 className="text-2xl font-semibold text-title lg:text-3xl">
        Support Given
      </h1>
      <div
        className={cn(
          'mt-3 min-h-28 w-full rounded-lg border p-5 font-medium text-subtext shadow-custom',
          supported.length === 0 &&
            'flex min-h-[200px] max-w-[600px] items-center justify-center md:min-h-[300px]',
        )}
      >
        {isLoading ? (
          <span className="text-lg">Loading...</span>
        ) : supported.length === 0 ? (
          <span className="text-lg">You haven't given any support yet</span>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xxl:grid-cols-4">
            {supported.map((support) => (
              <SupportGivenCard key={support.id} supportGiven={support} />
            ))}
          </div>
        )}
      </div>
    </LayoutDashboard>
  );
};

export default SupportGivenPage;
