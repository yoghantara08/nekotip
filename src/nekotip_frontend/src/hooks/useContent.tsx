import { useState } from 'react';

import { useAuthManager } from '@/store/AuthProvider';

const useContent = () => {
  const { actor } = useAuthManager();

  const [loadingLike, setLoadingLike] = useState(false);

  const toggleLike = async (contentId: string) => {
    try {
      setLoadingLike(true);
      if (actor) {
        await actor.toggleLike(contentId);
      }
    } catch (error) {
      console.error('Error liking content:', error);
    } finally {
      setLoadingLike(false);
    }
  };

  return { toggleLike, loadingLike };
};

export default useContent;
