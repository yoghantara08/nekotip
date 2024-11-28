import React, { useEffect, useState } from 'react';

import useUser from '@/hooks/useUser';

import {
  Transaction,
  User,
} from '../../../../../declarations/nekotip_backend/nekotip_backend.did';

interface SupporterCardProps {
  supporter: Transaction;
}

const SupporterCard = ({ supporter }: SupporterCardProps) => {
  const { getUserById } = useUser();

  const [profile, setProfile] = useState<User>();

  useEffect(() => {
    getUserById(supporter.from.toText()).then((result) => {
      if (result) setProfile(result);
    });
  }, [getUserById, supporter.from]);

  if (!profile) return null;

  return (
    <div className="flex flex-col gap-2 rounded-md border p-3 font-medium text-subtext md:flex-row md:gap-4">
      <img
        src={profile.profilePic[0] ?? '/images/user-default.svg'}
        alt="profilepicture"
        className="size-12 rounded-full border"
      />
      <div className="w-full max-w-[250px]">
        <p className="text-lg">{profile.name}</p>
        <p className="text-sm text-caption">@{profile.username}</p>
      </div>

      <div className="flex w-full max-w-[200px] items-center gap-1 md:flex-col md:items-start">
        <p>Has sent</p>
        <div className="flex items-center gap-1">
          <p>{supporter.amount.toString()} $ICP</p>
          <img src="/images/icp.svg" alt="ICP Logo" className="h-4 w-4" />
        </div>
      </div>

      <div className="w-full">{supporter.supportComment}</div>
    </div>
  );
};

export default SupporterCard;
