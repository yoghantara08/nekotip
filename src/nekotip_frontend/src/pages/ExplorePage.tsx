import React from 'react';

import Layout from '@/components/ui/Layout/Layout';
import CategoryButton from '@/components/features/CategoryButton/CategoryButton';
import ProfileCard from '@/components/features/ProfileCard/ProfileCard';


const ExplorePage = () => {
  return <Layout>
    <div>
      <h1 className='text-5xl font-semibold text-center'>Explore the Community</h1>
      <h2 className='text-xs font-medium text-center text-4E4C47 m-6'>Support your favorite creators and discover new talents!</h2>
    </div>
    <div className='mt-10'><CategoryButton/></div>
    <div className='mt-6'><ProfileCard/></div>
    
    </Layout>;
};

export default ExplorePage;
