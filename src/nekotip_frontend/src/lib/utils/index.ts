import BigNumber from 'bignumber.js';

import { EnumContentTier, ISerializedUser } from '@/types';

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
  if ('Free' in tier) return 'FREE';
  if ('Tier1' in tier) return 'TIER 1 - 5$';
  if ('Tier2' in tier) return 'TIER 2 - 15$';
  if ('Tier3' in tier) return 'TIER 3 - 30$';
  return 'Unknown';
};

export const getContentTierName = (tier: ContentTier): string => {
  if ('Free' in tier) return EnumContentTier.Free;
  if ('Tier1' in tier) return EnumContentTier.Tier1;
  if ('Tier2' in tier) return EnumContentTier.Tier2;
  if ('Tier3' in tier) return EnumContentTier.Tier3;
  return 'Unknown';
};

export const ContentTiers = {
  Free: { Free: null },
  Tier1: { Tier1: null },
  Tier2: { Tier2: null },
  Tier3: { Tier3: null },
} as const;

export const getDollarValueFromTier = (tier: string) => {
  switch (tier) {
    case EnumContentTier.Free:
      return 0;
    case EnumContentTier.Tier1:
      return 5;
    case EnumContentTier.Tier2:
      return 15;
    case EnumContentTier.Tier3:
      return 30;
    default:
      return 0;
  }
};

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

export const formatNSToDate = (nanoseconds: bigint): string => {
  // Convert nanoseconds to milliseconds
  const milliseconds = Number(nanoseconds / BigInt(1_000_000));

  // Create a Date object
  const date = new Date(milliseconds);

  // Format the date (e.g., "10 November 2024")
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  return date.toLocaleDateString('en-GB', options);
};

// Convert ICP to e8s (smallest unit)
export const convertToE8s = (icp: number) => {
  return Math.floor(icp * 10 ** 8);
};

// Convert e8s back to ICP for display
export const convertToICP = (e8s: number) => {
  return e8s / 10 ** 8;
};

export const convertUsdToIcp = (
  usdAmount: number | string,
  icpPrice: number,
  decimals: number = 4,
): number => {
  const amount = new BigNumber(usdAmount);
  const price = new BigNumber(icpPrice);

  const icpAmount = amount.dividedBy(price);

  return Number(icpAmount.toFixed(decimals));
};

export const convertIcpToUsd = (
  icpAmount: number | string,
  icpPrice: number,
  decimals: number = 2,
): number => {
  const amount = new BigNumber(icpAmount);
  const price = new BigNumber(icpPrice);

  const usdAmount = amount.multipliedBy(price);

  return Number(usdAmount.toFixed(decimals));
};
