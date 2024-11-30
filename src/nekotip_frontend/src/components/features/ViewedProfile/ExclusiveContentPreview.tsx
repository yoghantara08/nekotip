import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { LockIcon, MessageSquareIcon, ThumbsUpIcon } from 'lucide-react';

import useUser from '@/hooks/useUser';
import { formatNSToDate } from '@/lib/utils';
import { cn } from '@/lib/utils/cn';
import { EnumContentTier } from '@/types';

import { User } from '../../../../../declarations/nekotip_backend/nekotip_backend.did';

import UnlockContentModal from './UnlockContentModal';

interface ExclusiveContentPreviewProps {
  contentId: string;
  title: string;
  description: string;
  tier: string;
  thumbnail: string;
  likesCount: string;
  commentsCount: string;
  createdAt: bigint;
  isUnlocked?: boolean;
  className?: string;
  creatorId?: string;
}

const ExclusiveContentPreview = ({
  contentId,
  commentsCount,
  description,
  likesCount,
  thumbnail,
  tier,
  title,
  createdAt,
  isUnlocked,
  className,
  creatorId,
}: ExclusiveContentPreviewProps) => {
  const navigate = useNavigate();
  const { getUserById } = useUser();

  const [openModal, setOpenModal] = useState(false);
  const [creator, setCreator] = useState<User>();

  const handleContentClick = () => {
    if (tier === 'FREE' || isUnlocked) {
      navigate(`/creator/content/${contentId}`);
    } else {
      navigate(`/creator/${creator?.username}`);
    }
  };

  useEffect(() => {
    if (!creator && creatorId) {
      getUserById(creatorId).then((result) => {
        if (result) setCreator(result);
      });
    }
  }, [creator, creatorId, getUserById]);

  return (
    <div
      onClick={handleContentClick}
      className={cn(
        'min-w-[300px] max-w-md overflow-hidden rounded-lg border bg-offWhite text-subtext',
        (tier === EnumContentTier.Free || isUnlocked) &&
          'cursor-pointer hover:shadow-hover',
        className,
      )}
    >
      <div className="relative">
        <img
          src={thumbnail ?? '/images/banner-default.svg'}
          alt={title}
          className={cn('h-40 w-full rounded-t-md bg-mainAccent object-cover')}
        />
        <div
          className={cn(
            'absolute inset-0 hidden items-center justify-center bg-black/60',
            tier !== EnumContentTier.Free && !isUnlocked && 'flex',
          )}
        >
          <button
            className="flex items-center gap-2 rounded-lg bg-bg px-4 py-2 font-medium text-subtext hover:bg-mainAccent"
            onClick={() => setOpenModal(true)}
          >
            <LockIcon className="size-5" />
            <span>Unlock</span>
          </button>
        </div>
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-title">{title}</h2>
        {creatorId && (
          <div className="mb-3 mt-2 flex items-center gap-2">
            <img
              src={creator?.profilePic[0] ?? '/images/user-default.svg'}
              alt="profilepic"
              className="size-16 rounded-full"
            />

            <div>
              <p className="font-semibold">@{creator?.username}</p>
              <p className="text-sm text-caption">
                {formatNSToDate(BigInt(createdAt))}
              </p>
            </div>
          </div>
        )}

        {!creatorId && (
          <>
            <p className="text-sm text-caption">{description}</p>
            <p className="text-sm text-caption">
              {formatNSToDate(BigInt(createdAt))}
            </p>
          </>
        )}

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <ThumbsUpIcon className="size-5" />
              {likesCount}
            </div>
            <div className="flex items-center gap-1">
              <MessageSquareIcon className="size-5" />
              {commentsCount}
            </div>
          </div>
          <p
            className={cn(
              'bg- flex items-center rounded-lg border px-3 py-1 text-sm font-medium',
              tier === EnumContentTier.Free
                ? 'bg-thirdAccent'
                : isUnlocked
                  ? 'bg-mainAccent'
                  : '',
            )}
          >
            {tier === EnumContentTier.Free
              ? EnumContentTier.Free
              : isUnlocked
                ? 'Unlocked'
                : tier}
          </p>
        </div>
      </div>

      <UnlockContentModal
        contentId={contentId}
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        tier={tier}
        thumbnail={thumbnail}
        title={title}
      />
    </div>
  );
};

export default ExclusiveContentPreview;
