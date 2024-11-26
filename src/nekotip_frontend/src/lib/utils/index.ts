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

export const getContentTierLabel = (tier: ContentTier): string => {
  if ('Free' in tier) return 'Free';
  if ('Tier1' in tier) return 'Tier 1 - 5$';
  if ('Tier2' in tier) return 'Tier 2 - 15$';
  if ('Tier3' in tier) return 'Tier 3 - 30$';
  return 'Unknown';
};

export const getContentTierName = (tier: ContentTier): string => {
  if ('Free' in tier) return 'Free';
  if ('Tier1' in tier) return 'TIER 1 ';
  if ('Tier2' in tier) return 'TIER 2 ';
  if ('Tier3' in tier) return 'TIER 3 ';
  return 'Unknown';
};

export const ContentTiers = {
  Free: { Free: null },
  Tier1: { Tier1: null },
  Tier2: { Tier2: null },
  Tier3: { Tier3: null },
} as const;

export const ContentTierOptions = Object.values(ContentTiers).map((value) => ({
  label: getContentTierLabel(value),
  value,
}));

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
