import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Layout from '@/components/ui/Layout/Layout';
import { EXPLORE_CATEGORIES } from '@/constant/common';
import { cn } from '@/lib/utils/cn';
import { useAuthManager } from '@/store/AuthProvider';

import { User } from '../../../declarations/nekotip_backend/nekotip_backend.did';

const ExplorePage = () => {
  const { actor } = useAuthManager();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [creators, setCreators] = useState<User[]>([]);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const result = await actor?.getUsers();

        if (result) {
          setCreators(result);
        }
      } catch (error) {
        console.error(error);
      }
    };

    console.log('fetching');

    fetchCreators();
  }, [actor]);

  const filteredCreators = creators.filter((creator) => {
    if (selectedCategory === 'All') {
      return true;
    }
    return creator.categories[0] === selectedCategory;
  });

  return (
    <Layout title="Explore Creator">
      <h1 className="text-center text-3xl font-semibold text-title md:text-5xl">
        Explore the Community
      </h1>
      <h2 className="mt-2 text-center text-sm font-medium text-subtext md:mt-4 md:text-base">
        Support your favorite creators and discover new talents!
      </h2>
      <div className="mt-12 flex w-full max-w-[calc(100vw-16px)] gap-3 overflow-x-scroll pb-4 xxl:max-w-[1280px]">
        {EXPLORE_CATEGORIES.map((category) => (
          <button
            key={category}
            className={cn(
              'cursor-pointer border-2 border-border px-10 py-3 font-bold text-subtext hover:bg-mainAccent',
              selectedCategory === category && 'bg-mainAccent text-title',
            )}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="mt-6 grid gap-10 text-subtext md:grid-cols-2 xl:grid-cols-4">
        {filteredCreators.length > 0 ? (
          filteredCreators.map((creator) => (
            <Link to={`/creator/${creator.username}`} key={creator.username}>
              <div className="relative min-h-[250px] w-full cursor-pointer rounded-lg border bg-mainAccent/60 shadow-custom hover:shadow-hover">
                <img
                  src={creator.bannerPic[0] ?? '/images/banner-default.svg'}
                  alt="profile-banner"
                  className="h-[100px] w-full rounded-t-lg object-cover"
                />

                {creator.categories[0] && (
                  <span className="absolute bottom-[160px] right-3 rounded-md bg-offWhite px-2 py-0.5 text-xs font-medium">
                    {creator.categories[0]}
                  </span>
                )}

                <img
                  src={creator.profilePic[0] ?? '/images/user-default.svg'}
                  alt="profile-picture"
                  className="absolute bottom-[120px] left-3 size-20 rounded-full"
                />

                <div className="mt-4 space-y-1 p-4">
                  <div className="text-xl font-semibold text-title">
                    {creator.name}
                  </div>

                  <div className="text-sm">@{creator.username}</div>

                  <div className="break-all text-caption">
                    {creator.bio[0] ?? 'No bio'}
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <span className="text-xl font-medium">No creators found</span>
        )}
      </div>
    </Layout>
  );
};

export default ExplorePage;
