import { HeartIcon, MessageSquareIcon } from 'lucide-react';

interface ContentPreviewProps {
  title: string;
  description: string;
  tier: string;
  thumbnail: string;
  likesCount: string;
  commentsCount: string;
}

const ContentPreview = ({
  commentsCount,
  description,
  likesCount,
  thumbnail,
  tier,
  title,
}: ContentPreviewProps) => {
  return (
    <div className="max-w-md cursor-pointer rounded-lg border bg-mainAccent text-subtext">
      <img
        src={thumbnail}
        alt={title}
        className="h-40 w-full rounded-t-lg object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold text-title">{title}</h2>
        <p className="text-sm text-caption">{description}</p>

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
          <p className="rounded-lg border bg-secondaryAccent px-2 py-1 text-sm font-medium">
            {tier}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContentPreview;
