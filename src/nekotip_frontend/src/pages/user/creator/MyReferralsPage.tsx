import React, { useEffect, useState } from 'react';

import { CopyIcon, GiftIcon } from 'lucide-react';

import Button from '@/components/ui/Button/Button';
import LayoutDashboard from '@/components/ui/Layout/LayoutDashboard';
import useUser from '@/hooks/useUser';
import { useAuthManager } from '@/store/AuthProvider';

import { User } from '../../../../../declarations/nekotip_backend/nekotip_backend.did';

const MyReferrals = () => {
  const { user } = useUser();
  const { actor } = useAuthManager();

  const [referrals, setReferrals] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        setIsLoading(true);
        if (!actor) return;

        const result = await actor.getReferrals();

        if (result && referrals.length === 0) {
          setReferrals(result);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReferrals();
  }, [actor, referrals.length]);

  const handleCopy = () => {
    const referralLink = `${window.location.origin}/creator/${user?.username}?referral=${user?.referralCode}`;
    navigator.clipboard.writeText(referralLink).then(() => {
      alert('Referral link copied to clipboard!');
    });
  };

  return (
    <LayoutDashboard title="Referrals">
      <h1 className="text-2xl font-semibold text-title lg:text-3xl">
        My Referrals
      </h1>
      <div className="mt-3 w-full rounded-lg border p-4 text-subtext shadow-custom md:p-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
          <GiftIcon className="size-14 stroke-2" />
          <p className="max-w-[500px] font-montserrat text-sm font-medium md:text-base">
            Invite your creator friends and earn an extra 50% of the platform
            fee from every support they receive for 30 days!
          </p>
        </div>

        <div className="mt-3 flex flex-col gap-2 rounded-md bg-mainAccent p-4 md:mt-5 md:flex-row md:gap-4">
          <p className="mr-5 text-lg font-semibold">Your Referral Link</p>
          <div className="space-y-2">
            <div className="w-full rounded-lg border bg-bg p-3 pr-4 font-medium">
              {`${window.location.origin}/creator/${user?.username}?referral=${user?.referralCode}`}
            </div>
            <Button
              variant="third"
              shadow={false}
              icon={<CopyIcon className="mr-2 size-5" />}
              onClick={handleCopy}
            >
              Copy Link
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-5 w-full space-y-2 rounded-lg border p-5 text-subtext shadow-custom">
        <h2 className="text-lg font-semibold">Referral List</h2>
        {isLoading ? (
          <span className="text-lg">Loading...</span>
        ) : referrals.length === 0 ? (
          <span className="text-lg">You don't have any supporter yet</span>
        ) : (
          <div className="flex flex-wrap gap-5">
            {referrals.map((follower) => (
              <div
                key={follower.username}
                className="flex w-full gap-2 rounded-md border p-3 px-4 font-medium text-subtext md:w-fit"
              >
                <img
                  src={follower.profilePic[0] ?? '/images/user-default.svg'}
                  alt="profilepicture"
                  className="size-12 rounded-full border"
                />
                <div className="w-full min-w-[200px]">
                  <p className="text-lg">{follower.name}</p>
                  <p className="text-sm text-caption md:text-base">
                    @{follower.username}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </LayoutDashboard>
  );
};

export default MyReferrals;
