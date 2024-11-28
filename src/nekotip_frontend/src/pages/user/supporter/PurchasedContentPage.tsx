import React, { useEffect, useState } from 'react';

import ExclusiveContentPreview from '@/components/features/ViewedProfile/ExclusiveContentPreview';
import LayoutDashboard from '@/components/ui/Layout/LayoutDashboard';
import { cn } from '@/lib/utils/cn';
import { useAuthManager } from '@/store/AuthProvider';

import { ContentPreview as ContentPreviewType } from '../../../../../declarations/nekotip_backend/nekotip_backend.did';

const dummy = {
  contentId: 'content-123',
  title: 'Exclusive Insights on Blockchain Technology',
  description:
    'Dive into the latest trends and insights in blockchain and crypto developments.',
  tier: 'Premium',
  thumbnail: 'https://via.placeholder.com/300x200?text=Exclusive+Content',
  likesCount: '256',
  commentsCount: '42',
  createdAt: '2024-11-28T10:30:00Z',
  isUnlocked: false,
  className: 'content-preview-card',
  onOpenUnlockModal: () => {
    console.log('Unlock modal opened for contentId: content-123');
  },
};

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
        console.log(error);
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
                contentId={dummy.contentId}
                title={dummy.title}
                description={dummy.description}
                tier={dummy.tier}
                thumbnail={dummy.thumbnail}
                likesCount={dummy.likesCount}
                commentsCount={dummy.commentsCount}
                createdAt={dummy.createdAt}
              />
            ))}
          </div>
        )}
      </div>
    </LayoutDashboard>
  );
};

export default PurchasedContentPage;
