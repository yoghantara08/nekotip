import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { PlusIcon } from 'lucide-react';

import Button from '@/components/ui/Button/Button';
import useWindowSize from '@/hooks/useWindowSize';
import { fetchCreatorContentPreview } from '@/lib/services/contentService';
import { formatNSToDate, getContentTierLabel } from '@/lib/utils';
import { cn } from '@/lib/utils/cn';
import { useAuthManager } from '@/store/AuthProvider';

import { ContentPreview as ContentPreviewType } from '../../../../../declarations/nekotip_backend/nekotip_backend.did';

import ContentPreview from './ContentPreview';

const ContentManagement = () => {
  const { actor, principal } = useAuthManager();
  const { isMobile } = useWindowSize();

  const [contents, setContents] = useState([] as ContentPreviewType[]);

  useEffect(() => {
    if (actor && principal)
      fetchCreatorContentPreview(actor, principal, setContents);
  }, [actor, principal]);

  return (
    <>
      <div className="flex flex-col gap-3 md:flex-row md:justify-between">
        <h1 className="text-2xl font-semibold text-title lg:text-3xl">
          Content Management
        </h1>
        <Link to={'/dashboard/creator-studio/post'}>
          <Button
            variant="secondary"
            className="w-fit"
            icon={<PlusIcon className="mr-1 size-5" />}
            size={isMobile ? 'small' : 'default'}
          >
            Post New Content
          </Button>
        </Link>
      </div>
      <div
        className={cn(
          'mt-3 w-fit rounded-lg border border-border p-3 shadow-custom md:px-5 md:py-4',
          contents.length === 0 &&
            'flex min-h-[200px] w-full items-center justify-center md:min-h-[500px]',
        )}
      >
        {contents.length === 0 ? (
          <div className="mb-4 flex flex-col items-center space-y-3 text-subtext">
            <p className="text-center font-semibold md:text-lg">
              No content yet. Start creating your first exclusive post!
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-5">
            {contents.map((content) => (
              <Link key={content.id} to={`/creator/content/${content.id}`}>
                <ContentPreview
                  title={content.title}
                  description={content.description}
                  tier={getContentTierLabel(content.tier)}
                  thumbnail={content.thumbnail}
                  likesCount={content.likesCount.toString()}
                  commentsCount={content.commentsCount.toString()}
                  createdAt={formatNSToDate(content.createdAt)}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ContentManagement;
