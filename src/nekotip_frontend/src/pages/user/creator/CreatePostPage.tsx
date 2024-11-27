import React from 'react';

import CreatePostForm from '@/components/features/ContentManagement/CreatePostForm';
import LayoutDashboard from '@/components/ui/Layout/LayoutDashboard';

const CreatePostPage = () => {
  return (
    <LayoutDashboard title="Create Post" className="w-full">
      <h1 className="text-2xl font-semibold text-title lg:text-3xl">
        Create Post
      </h1>
      <CreatePostForm />
    </LayoutDashboard>
  );
};

export default CreatePostPage;
