import { useEffect, useState } from 'react';

import LayoutDashboard from '@/components/ui/Layout/LayoutDashboard';
import { cn } from '@/lib/utils/cn';
import { useAuthManager } from '@/store/AuthProvider';

import { User } from '../../../../../declarations/nekotip_backend/nekotip_backend.did';

const MyFollowersPage = () => {
  const { actor, principal } = useAuthManager();

  const [followers, setFollowers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        setIsLoading(true);
        if (!actor || !principal) return;

        const result = await actor.getFollowers();

        if (result && followers.length === 0) {
          setFollowers(result);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFollowers();
  }, [actor, followers.length, principal]);

  return (
    <LayoutDashboard title="Followers" className="w-full">
      <h1 className="text-2xl font-semibold text-title lg:text-3xl">
        My Followers
      </h1>
      <div
        className={cn(
          'mt-3 min-h-28 w-full rounded-lg border p-5 font-medium text-subtext shadow-custom',
          followers.length === 0 &&
            'flex min-h-[200px] max-w-[600px] items-center justify-center md:min-h-[300px]',
        )}
      >
        {isLoading ? (
          <span className="text-lg">Loading...</span>
        ) : followers.length === 0 ? (
          <span className="text-lg">You don't have any supporter yet</span>
        ) : (
          <div className="flex flex-wrap gap-5">
            {followers.map((follower) => (
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

export default MyFollowersPage;
