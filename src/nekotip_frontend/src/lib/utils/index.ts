import { ISerializedUser } from '@/types/user.types';

import { User } from '../../../../declarations/nekotip_backend/nekotip_backend.did';

export const serializeUser = (user: User): ISerializedUser => {
  return {
    id: user.id.toText(),
    bio: user.bio[0] ?? null,
    categories:
      user.categories[0]?.map((category) => Object.keys(category)[0]) ?? [],
    referralCode: user.referralCode,
    username: user.username,
    name: user.name[0] ?? null,
    createdAt: Number(user.createdAt),
    socials: user.socials[0]
      ? {
          tiktok: user.socials[0].tiktok[0] ?? null,
          twitch: user.socials[0].twitch[0] ?? null,
          twitter: user.socials[0].twitter[0] ?? null,
          instagram: user.socials[0].instagram[0] ?? null,
          website: user.socials[0].website[0] ?? null,
          facebook: user.socials[0].facebook[0] ?? null,
          discord: user.socials[0].discord[0] ?? null,
          youtube: user.socials[0].youtube[0] ?? null,
        }
      : null,
    depositAddress: user.depositAddress,
    referredBy: user.referredBy[0]?.toText() ?? null,
    bannerPic: user.bannerPic[0] ?? null,
    followersCount: user.followers.length,
    followingCount: user.following.length,
    referralsCount: user.referrals.length,
    profilePic: user.profilePic[0] ?? null,
  };
};
