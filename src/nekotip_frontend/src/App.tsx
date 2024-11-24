import { useEffect } from 'react';
import { Route, Routes, useSearchParams } from 'react-router-dom';

import ProtectedRoute from './components/features/ProtectedRoute/ProtectedRoute';
import { useAuthManager } from './hooks/useAuthManager';
import useUser from './hooks/useUser';
import ContentPage from './pages/ContentPage';
import ExplorePage from './pages/ExplorePage';
import LandingPage from './pages/LandingPage';
import ContentManagement from './pages/user/creator/ContentManagement';
import ManageProfilePage from './pages/user/creator/ManageProfilePage';
import MyFollowersPage from './pages/user/creator/MyFollowersPage';
import MyReferrals from './pages/user/creator/MyReferralsPage';
import MySupporterPage from './pages/user/creator/MySupporterPage';
import WalletPage from './pages/user/creator/WalletPage';
import DiscoverPage from './pages/user/supporter/DiscoverPage';
import ExclusiveContent from './pages/user/supporter/ExclusiveContent';
import FollowedCreatorsPage from './pages/user/supporter/FollowedCreatorsPage';
import SupportGivenPage from './pages/user/supporter/SupportGivenPage';
import ViewedProfilePage from './pages/user/ViewedProfilePage';

function App() {
  const [searchParams] = useSearchParams();

  const { updateReferralCode, fetchUser } = useUser();
  const { initializeAuth, isAuthenticated, principal, actor } =
    useAuthManager();

  // INITIALIZE AUTHENTICATION
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // FETCH USER DATA
  useEffect(() => {
    if (isAuthenticated && principal && actor) {
      fetchUser(principal, actor);
    }
  }, [actor, fetchUser, isAuthenticated, principal]);

  useEffect(() => {
    const referralCode = searchParams.get('referral');
    updateReferralCode(referralCode ?? '');
  }, [searchParams, updateReferralCode]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/explore" element={<ExplorePage />} />
      <Route path="/creator/:creatorId" element={<ViewedProfilePage />} />
      <Route path="/creator/content/:contentId" element={<ContentPage />} />

      {/* Protected Routes = Authenticated */}
      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
        {/* Supporter Dashboard */}
        <Route path="/dashboard/discover" element={<DiscoverPage />} />
        <Route
          path="/dashboard/exclusive-content"
          element={<ExclusiveContent />}
        />
        <Route path="/dashboard/following" element={<FollowedCreatorsPage />} />
        <Route path="/dashboard/support-given" element={<SupportGivenPage />} />

        {/* Creator Dashboard */}
        <Route path="/dashboard" element={<ManageProfilePage />} />
        <Route
          path="/dashboard/content-management"
          element={<ContentManagement />}
        />
        <Route path="/dashboard/wallet" element={<WalletPage />} />
        <Route path="/dashboard/supporter" element={<MySupporterPage />} />
        <Route path="/dashboard/followers" element={<MyFollowersPage />} />
        <Route path="/dashboard/referrals" element={<MyReferrals />} />
      </Route>
    </Routes>
  );
}

export default App;
