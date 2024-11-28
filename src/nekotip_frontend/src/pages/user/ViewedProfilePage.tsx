import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { UserRoundPlusIcon } from 'lucide-react';

import ExclusiveContentPanel from '@/components/features/ViewedProfile/ExclusiveContentPanel';
import HomePanel from '@/components/features/ViewedProfile/HomePanel';
import Layout from '@/components/ui/Layout/Layout';
import useUser from '@/hooks/useUser';
import { cn } from '@/lib/utils/cn';

import { User } from '../../../../declarations/nekotip_backend/nekotip_backend.did';

const MENU_PROFILE = ['Home', 'Exclusive Contents'];

const ViewedProfilePage = () => {
  const { username } = useParams();
  const { getUserByUsername } = useUser();

  const [user, setUser] = useState<User | null>(null);
  const [menu, setMenu] = useState('Home');

  useEffect(() => {
    if (username && !user) {
      getUserByUsername(username).then((result) => {
        if (result) setUser(result);
        console.log('test');
      });
    }
  }, [getUserByUsername, user, username]);

  if (user)
    return (
      <Layout title={user.name[0]}>
        <div className="w-full rounded-lg border text-subtext shadow-custom">
          <div className="relative">
            <img
              src={user?.bannerPic[0] || '/images/default-banner.png'}
              alt="banner"
              className="h-[200px] w-full rounded-t-lg object-cover"
            />
            <img
              src={user?.profilePic[0] || '/images/user-default.svg'}
              alt="profile"
              className="absolute -bottom-10 left-5 size-20 rounded-full md:size-28"
            />
          </div>
          <main className="px-4 pb-8 pt-12 md:px-6 md:py-16">
            <section className="flex items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-semibold text-title">
                  {user.name[0]}
                </h1>
                <p className="text-lg text-subtext">@{user.username}</p>
              </div>
              <div>
                <button className="flex items-center gap-2 rounded-lg border px-4 py-2 font-semibold text-subtext hover:bg-mainAccent">
                  <UserRoundPlusIcon />
                  Follow
                </button>
              </div>
            </section>

            <section className="mt-2 space-y-5 md:mt-4">
              <div className="md:hidden">
                <div className="text-caption">
                  <span>{user.bio[0] || 'This user has no bio yet.'}</span>
                </div>
                <Link
                  to={`/explore/${user.categories.toLocaleString().toLowerCase()}`}
                  className="mt-2 block w-fit rounded-lg border px-4 py-2 text-sm font-medium hover:bg-mainAccent/30"
                >
                  {user.categories}
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
              {menu === 'Home' && <HomePanel user={user} />}
              {menu === 'Exclusive Contents' && (
                <ExclusiveContentPanel creatorId={user.id} />
              )}
            </section>
          </main>
        </div>
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
