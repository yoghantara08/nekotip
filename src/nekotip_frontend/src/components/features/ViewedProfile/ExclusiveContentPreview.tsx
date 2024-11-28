import React from 'react';
import { useNavigate } from 'react-router-dom';

import { HeartIcon, LockIcon, MessageSquareIcon } from 'lucide-react';

import { cn } from '@/lib/utils/cn';

interface ExclusiveContentPreviewProps {
  contentId: string;
  title: string;
  description: string;
  tier: string;
  thumbnail: string;
  likesCount: string;
  commentsCount: string;
  createdAt: string;
  isUnlocked?: boolean;
  className?: string;
  onOpenUnlockModal?: () => void;
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
  onOpenUnlockModal,
}: ExclusiveContentPreviewProps) => {
  const navigate = useNavigate();

  const handleContentClick = () => {
    if (tier === 'Free' || isUnlocked) {
      navigate(`/creator/content/${contentId}`);
    } else if (onOpenUnlockModal) {
      onOpenUnlockModal();
    }
  };

  return (
    <div
      onClick={handleContentClick}
      className={cn(
        'bg-offWhite min-w-[300px] max-w-md overflow-hidden rounded-lg border text-subtext',
        (tier === 'Free' || isUnlocked) && 'cursor-pointer hover:shadow-hover',
        className,
      )}
    >
      <div className="relative">
        <img
          src={thumbnail}
          alt={title}
          className={cn('h-40 w-full rounded-t-md bg-mainAccent object-cover')}
        />
        <div
          className={cn(
            'absolute inset-0 hidden items-center justify-center bg-black/60',
            tier !== 'Free' && !isUnlocked && 'flex',
          )}
        >
          <button
            className="bg-offWhite flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-subtext"
            onClick={onOpenUnlockModal}
          >
            <LockIcon className="size-5" />
            <span>Unlock</span>
          </button>
        </div>
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-title">{title}</h2>
        <p className="text-sm text-caption">{description}</p>
        <p className="text-sm text-caption">{createdAt}</p>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <HeartIcon className="size-5" />
              {likesCount}
            </div>
            <div className="flex items-center gap-1">
              <MessageSquareIcon className="size-5" />
              {commentsCount}
            </div>
          </div>
          <p className="bg- flex items-center rounded-lg border px-3 py-1 text-sm font-medium">
            {tier === 'Free' ? 'Free' : isUnlocked ? 'Unlocked' : tier}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExclusiveContentPreview;
