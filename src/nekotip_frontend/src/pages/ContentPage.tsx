import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { ThumbsUpIcon } from 'lucide-react';

import Button from '@/components/ui/Button/Button';
import Layout from '@/components/ui/Layout/Layout';
import useUser from '@/hooks/useUser';
import { getContentTierName } from '@/lib/utils';
import { useAuthManager } from '@/store/AuthProvider';

import {
  Content,
  ContentPreview,
  User,
} from '../../../declarations/nekotip_backend/nekotip_backend.did';

const ContentPage = () => {
  const { contentId } = useParams();
  const { actor } = useAuthManager();
  const { getUserById } = useUser();

  const [content, setContent] = useState<Content>();
  const [contentPreview, setContentPreview] = useState<ContentPreview | null>();
  const [creator, setCreator] = useState<User | undefined>(undefined);
  const [likesCount, setLikesCount] = useState(0);
  const [loadingLike, setLoadingLike] = useState(false);
  const [errorFetching, setErrorFetching] = useState(false);

  const toggleLike = async (contentId: string) => {
    try {
      setLoadingLike(true);
      if (actor) {
        const result = await actor.toggleLike(contentId);

        if ('ok' in result) {
          setLikesCount(result.ok.likes.length);
        }
      }
    } catch (error) {
      console.error('Error liking content:', error);
    } finally {
      setLoadingLike(false);
    }
  };

  useEffect(() => {
    const fetchContentDetails = async () => {
      if (!contentId) {
        console.error('Content ID is missing');
        return;
      }

      try {
        const result = await actor?.getContentDetails(contentId);

        if (result && !content) {
          if ('ok' in result) {
            setContent(result.ok);
            setLikesCount(result.ok.likes.length);
          } else if ('err' in result) {
            if (result.err[0]) {
              setContentPreview(result.err[0]);
            } else {
              setErrorFetching(true);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };

    fetchContentDetails();

    if (content && !creator) {
      getUserById(content.creatorId.toText()).then((result) => {
        if (result) setCreator(result);
      });
    }
  }, [actor, content, contentId, contentPreview, creator, getUserById]);

  if (content && creator) {
    return (
      <Layout title={content.title}>
        <div className="space-y-5">
          <div className="flex w-full flex-col items-center space-y-3">
            <h1 className="text-center text-xl font-semibold capitalize text-title md:text-3xl">
              {content.title}
            </h1>
            <div className="rounded-lg border px-5 py-2 text-sm font-medium text-subtext shadow-hover md:text-base md:font-semibold">
              {getContentTierName(content.tier)}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <Link
              to={`/creator/${creator.username}`}
              className="flex items-center gap-x-3"
            >
              <img
                src={creator.profilePic[0] || '/images/user-default.svg'}
                alt={creator.username}
                className="size-14 rounded-full md:size-20"
              />
              <div className="font-medium text-subtext">
                <p className="text-xl">{creator.name}</p>
                <p className="text-caption">@{creator.username}</p>
              </div>
            </Link>
            <Button
              shadow={false}
              icon={<ThumbsUpIcon className="mr-2 size-4 md:size-5" />}
              onClick={() => toggleLike(content.id)}
              disabled={loadingLike}
            >
              {likesCount} Like
            </Button>
          </div>

          <p className="font-montserrat text-sm font-medium text-subtext md:text-lg">
            {content.description}
          </p>
          <div className="flex flex-wrap gap-4">
            {content.contentImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={content.title}
                className="h-fit w-full max-w-xl"
              />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (contentPreview) {
    return (
      <Layout>
        <p className="text-2xl font-semibold text-title">
          You dont have access to this exclusive content!
        </p>
      </Layout>
    );
  }

  if (errorFetching) {
    return (
      <Layout>
        <p className="text-2xl font-semibold text-title">Content not found!</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <p className="text-2xl font-semibold text-title">Loading content...</p>
    </Layout>
  );
};

export default ContentPage;
