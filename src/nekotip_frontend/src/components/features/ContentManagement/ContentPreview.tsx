import { HeartIcon, MessageSquareIcon } from 'lucide-react';

import { cn } from '@/lib/utils/cn';

interface ContentPreviewProps {
  title: string;
  description: string;
  tier: string;
  thumbnail: string;
  likesCount: string;
  commentsCount: string;
  createdAt: string;
  isUnlocked?: boolean;
  className?: string;
}

const ContentPreview = ({
  commentsCount,
  description,
  likesCount,
  thumbnail,
  tier,
  title,
  createdAt,
  isUnlocked,
  className,
}: ContentPreviewProps) => {
  return (
    <div
      className={cn(
        'bg-offWhite min-w-[300px] max-w-md cursor-pointer rounded-lg border text-subtext transition-all hover:shadow-hover',
        className,
      )}
    >
      <img
        src={thumbnail}
        alt={title}
        className="h-40 w-full rounded-t-lg bg-mainAccent object-cover"
      />
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

export default ContentPreview;
