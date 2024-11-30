import { useEffect, useState } from 'react';

import ExclusiveContentPreview from '@/components/features/ViewedProfile/ExclusiveContentPreview';
import LayoutDashboard from '@/components/ui/Layout/LayoutDashboard';
import { fetchAllContentPreview } from '@/lib/services/contentService';
import { getContentTierName } from '@/lib/utils';
import { useAuthManager } from '@/store/AuthProvider';

import { ContentPreview } from '../../../../../declarations/nekotip_backend/nekotip_backend.did';

const DiscoverPage = () => {
  const { actor, principal } = useAuthManager();

  const [contents, setContents] = useState<ContentPreview[] | []>([]);

  useEffect(() => {
    if (actor) {
      fetchAllContentPreview(actor, setContents);
    }
  }, [actor]);

  return (
    <LayoutDashboard title="Discover" className="w-full md:w-fit">
      <h1 className="text-start text-2xl font-semibold text-title lg:text-3xl">
        Discover
      </h1>
      <div className="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {contents.map((content) => {
          const isUnlocked = content.unlockedBy.some(
            (userId) => userId.toText() === principal?.toText(),
          );

          return (
            <ExclusiveContentPreview
              key={content.id.toString()}
              contentId={content.id}
              title={content.title}
              description={content.description}
              tier={getContentTierName(content.tier)}
              thumbnail={content.thumbnail}
              likesCount={content.likesCount.toString()}
              commentsCount={content.commentsCount.toString()}
              createdAt={content.createdAt}
              isUnlocked={isUnlocked}
              creatorId={content.creatorId.toText()}
            />
          );
        })}
      </div>
    </LayoutDashboard>
  );
};

export default DiscoverPage;
