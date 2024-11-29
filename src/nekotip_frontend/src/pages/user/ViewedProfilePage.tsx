import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { Principal } from '@dfinity/principal';
import { UserRoundCheckIcon, UserRoundPlusIcon } from 'lucide-react';

import ExclusiveContentPanel from '@/components/features/ViewedProfile/ExclusiveContentPanel';
import ProfileHomePanel from '@/components/features/ViewedProfile/ProfileHomePanel';
import Layout from '@/components/ui/Layout/Layout';
import useUser from '@/hooks/useUser';
import { cn } from '@/lib/utils/cn';
import { useAuthManager } from '@/store/AuthProvider';

import { User } from '../../../../declarations/nekotip_backend/nekotip_backend.did';

const MENU_PROFILE = ['Home', 'Exclusive Contents'];

const ViewedProfilePage = () => {
  const { username } = useParams();
  const { getUserByUsername, user } = useUser();
  const { actor, principal } = useAuthManager();

  const [viewedUser, setViewedUser] = useState<User | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [menu, setMenu] = useState('Home');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingToggleFollow, setLoadingToggleFollow] = useState(false);

  useEffect(() => {
    if (username && !viewedUser) {
      setIsLoading(true);
      getUserByUsername(username)
        .then((result) => {
          if (result) {
            setViewedUser(result);
            setNotFound(false);
          } else {
            setNotFound(true);
          }
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => setIsLoading(false));
    }
  }, [getUserByUsername, viewedUser, username]);

  const toggleFollow = async (target: Principal) => {
    try {
      setLoadingToggleFollow(true);
      if (viewedUser && actor) {
        const result = await actor.toggleFollow(target);

        if ('ok' in result) {
          const updatedUser = await getUserByUsername(username!);
          if (updatedUser) {
            setViewedUser(updatedUser);
          }
        }
      }
    } catch (error) {
      console.error('Error following user:', error);
    } finally {
      setLoadingToggleFollow(false);
    }
  };

  const isFollowing = viewedUser?.followers.some(
    (follower) => follower.toText() === principal?.toText(),
  );

  if (viewedUser && !isLoading && !notFound)
    return (
      <Layout title={viewedUser.name[0]}>
        <div className="w-full rounded-lg border text-subtext shadow-custom">
          <div className="relative">
            <img
              src={viewedUser?.bannerPic[0] || '/images/banner-default.svg'}
              alt="banner"
              className="h-[200px] w-full rounded-t-lg object-cover"
            />
            <img
              src={viewedUser?.profilePic[0] || '/images/user-default.svg'}
              alt="profile"
              className="absolute -bottom-10 left-5 size-20 rounded-full md:size-28"
            />
          </div>
          <main className="px-4 pb-8 pt-12 md:px-6 md:py-16">
            <section className="flex items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-semibold text-title">
                  {viewedUser.name[0]}
                </h1>
                <p className="text-lg text-subtext">@{viewedUser.username}</p>
              </div>

              {user && user.username !== viewedUser.username && (
                <button
                  disabled={loadingToggleFollow}
                  className={cn(
                    'flex items-center gap-2 rounded-lg border px-4 py-2 font-semibold text-subtext hover:bg-thirdAccent/50',
                    isFollowing && 'bg-thirdAccent',
                    loadingToggleFollow &&
                      'cursor-not-allowed bg-thirdAccent/50',
                  )}
                  onClick={() => toggleFollow(viewedUser.id)}
                >
                  {isFollowing ? <UserRoundCheckIcon /> : <UserRoundPlusIcon />}
                  {isFollowing
                    ? 'Followed'
                    : loadingToggleFollow
                      ? 'Following...'
                      : 'Follow'}
                </button>
              )}
            </section>

            <section className="mt-2 space-y-5 md:mt-4">
              <div className="md:hidden">
                <div className="text-caption">
                  <span>
                    {viewedUser.bio[0] || 'This user has no bio yet.'}
                  </span>
                </div>
                <Link
                  to={`/creator/${viewedUser.categories.toLocaleString().toLowerCase()}`}
                  className="mt-2 block w-fit rounded-lg border px-4 py-2 text-sm font-medium hover:bg-mainAccent/30"
                >
                  {viewedUser.categories}
                </Link>
              </div>
              <div className="flex w-fit items-center gap-4">
                {MENU_PROFILE.map((item, index) => (
                  <button
                    key={index}
                    className={cn(
                      'border px-4 py-2 font-medium hover:bg-mainAccent',
                      menu === item && 'bg-mainAccent',
                    )}
                    onClick={() => setMenu(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
              {menu === 'Home' && <ProfileHomePanel viewedUser={viewedUser} />}
              {menu === 'Exclusive Contents' && (
                <ExclusiveContentPanel creatorId={viewedUser.id} />
              )}
            </section>
          </main>
        </div>
      </Layout>
    );

  if (notFound && !isLoading)
    return (
      <Layout>
        <p className="font-montserrat text-xl font-medium text-subtext">
          404 User not found...
        </p>
      </Layout>
    );

  return (
    <Layout>
      <p className="font-montserrat text-xl font-medium text-subtext">
        Loading...
      </p>
    </Layout>
  );
};

export default ViewedProfilePage;
