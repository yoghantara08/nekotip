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
  followers: string[];
  following: string[];
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
export enum EnumCategory {
  Animation = 'Animation',
  Art = 'Art',
  Blogging = 'Blogging',
  ComicsAndCartoons = 'ComicsAndCartoons',
  Commissions = 'Commissions',
  Community = 'Community',
  Cosplay = 'Cosplay',
  DanceAndTheatre = 'DanceAndTheatre',
  Design = 'Design',
  DrawingAndPainting = 'DrawingAndPainting',
  Education = 'Education',
  FoodAndDrink = 'FoodAndDrink',
  Gaming = 'Gaming',
  HealthAndFitness = 'HealthAndFitness',
  Lifestyle = 'Lifestyle',
  Money = 'Money',
  Music = 'Music',
  News = 'News',
  Other = 'Other',
  Photography = 'Photography',
  Podcast = 'Podcast',
  ScienceAndTech = 'ScienceAndTech',
  Social = 'Social',
  Software = 'Software',
  Streaming = 'Streaming',
  Translator = 'Translator',
  VideoAndFilm = 'VideoAndFilm',
  Writing = 'Writing',
}
