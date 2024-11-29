import React, { useEffect, useState } from 'react';

import ExclusiveContentPreview from '@/components/features/ViewedProfile/ExclusiveContentPreview';
import LayoutDashboard from '@/components/ui/Layout/LayoutDashboard';
import { getContentTierName } from '@/lib/utils';
import { cn } from '@/lib/utils/cn';
import { useAuthManager } from '@/store/AuthProvider';

import { ContentPreview as ContentPreviewType } from '../../../../../declarations/nekotip_backend/nekotip_backend.did';

const PurchasedContentPage = () => {
  const { actor } = useAuthManager();

  const [purchasedContents, setPurchasedContents] = useState<
    ContentPreviewType[] | []
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPurchasedContents = async () => {
      try {
        setIsLoading(true);
        if (!actor) return;

        const result = await actor.getPurchasedContentPreviews();
        if (result && purchasedContents.length === 0) {
          setPurchasedContents(result);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchasedContents();
  }, [actor, purchasedContents.length]);

  return (
    <LayoutDashboard title="Purcashed Content" className="w-full">
      <h1 className="text-2xl font-semibold text-title lg:text-3xl">
        My Purchased Content
      </h1>
      <div
        className={cn(
          'mt-3 min-h-28 w-full rounded-lg border p-5 font-medium text-subtext shadow-custom',
          purchasedContents.length === 0 &&
            'flex min-h-[200px] max-w-[600px] items-center justify-center md:min-h-[300px]',
        )}
      >
        {isLoading ? (
          <span className="text-lg">Loading...</span>
        ) : purchasedContents.length === 0 ? (
          <span className="text-lg">No purchased contents...</span>
        ) : (
          <div className="flex flex-wrap gap-5">
            {purchasedContents.map((content) => (
              <ExclusiveContentPreview
                key={content.id}
                contentId={content.id}
                title={content.title}
                description={content.description}
                tier={getContentTierName(content.tier)}
                thumbnail={content.thumbnail}
                likesCount={content.likesCount.toString()}
                commentsCount={content.commentsCount.toString()}
                createdAt={content.createdAt.toString()}
                isUnlocked
              />
            ))}
          </div>
        )}
      </div>
    </LayoutDashboard>
  );
};

export default PurchasedContentPage;
