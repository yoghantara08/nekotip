import { ISerializedUser } from '@/types/user.types';

import {
  ContentTier,
  User,
} from '../../../../declarations/nekotip_backend/nekotip_backend.did';

export const serializeUser = (user: User): ISerializedUser => {
  return {
    id: user.id.toText(),
    bio: getOptionalValue(user.bio),
    categories: user.categories,
    referralCode: user.referralCode,
    username: user.username,
    name: getOptionalValue(user.name),
    createdAt: Number(user.createdAt),
    socials: user.socials ?? null,
    depositAddress: user.depositAddress,
    referredBy: user.referredBy[0]?.toText() ?? null,
    bannerPic: getOptionalValue(user.bannerPic),
    followersCount: user.followers.length,
    followingCount: user.following.length,
    referralsCount: user.referrals.length,
    profilePic: getOptionalValue(user.profilePic),
  };
};

export const getContentTierName = (tier: ContentTier): string => {
  if ('Free' in tier) return 'Free';
  if ('Tier1' in tier) return 'Tier 1';
  if ('Tier2' in tier) return 'Tier 2';
  if ('Tier3' in tier) return 'Tier 3';
  return 'Unknown';
};

export const getOptionalValue = <T>(field: [] | [T]): T | null =>
  field[0] ?? null;

export const openPage = (e: any, url: string) => {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  // IOS issue when open new pop window
  setTimeout(() => {
    if (window.navigator.userAgent?.toLowerCase().includes('metamask')) {
      window.location.assign(url);
    } else {
      window.open(url, '_blank');
    }
  });
};
