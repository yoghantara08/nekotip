/* eslint-disable no-unused-vars */
export interface ISerializedUser {
  id: string;
  bio: string | null;
  categories: string[];
  referralCode: string;
  username: string;
  name: string | null;
  createdAt: number;
  socials: ISocials | null;
  depositAddress: string;
  referredBy: string | null;
  bannerPic: string | null;
  followersCount: number;
  followingCount: number;
  referralsCount: number;
  profilePic: string | null;
}

export interface ISocials {
  tiktok: string | null;
  twitch: string | null;
  twitter: string | null;
  instagram: string | null;
  website: string | null;
  facebook: string | null;
  discord: string | null;
  youtube: string | null;
}
