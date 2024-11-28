import React, { useEffect, useState } from 'react';

import { Principal } from '@dfinity/principal';

import { fetchCreatorContentPreview } from '@/lib/services/contentService';
import { formatNSToDate, getContentTierLabel } from '@/lib/utils';
import { useAuthManager } from '@/store/AuthProvider';

import { ContentPreview as ContentPreviewType } from '../../../../../declarations/nekotip_backend/nekotip_backend.did';

import ExclusiveContentPreview from './ExclusiveContentPreview';

const ExclusiveContentPanel = ({ creatorId }: { creatorId: Principal }) => {
  const { actor } = useAuthManager();

  const [contents, setContents] = useState<ContentPreviewType[] | []>([]);

  useEffect(() => {
    if (actor) {
      fetchCreatorContentPreview(actor, creatorId, setContents);
    }
  }, [actor, creatorId]);

  console.log(contents);

  return (
    <div className="flex flex-wrap gap-5">
      {contents.map((content) => (
        <ExclusiveContentPreview
          key={content.id.toString()}
          contentId={content.id}
          title={content.title}
          description={content.description}
          tier={getContentTierLabel(content.tier)}
          thumbnail={content.thumbnail}
          likesCount={content.likesCount.toString()}
          commentsCount={content.commentsCount.toString()}
          createdAt={formatNSToDate(content.createdAt)}
        />
      ))}
    </div>
  );
};

export default ExclusiveContentPanel;
