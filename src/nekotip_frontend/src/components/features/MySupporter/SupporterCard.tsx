import React, { useEffect, useState } from 'react';

import useUser from '@/hooks/useUser';
import { convertToICP } from '@/lib/utils';

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
    if (!profile) {
      getUserById(supporter.from.toText()).then((result) => {
        if (result) setProfile(result);
      });
    }
  }, [getUserById, profile, supporter.from]);

  if (!profile) return null;

  return (
    <div className="break-all rounded-md border p-3 font-medium text-subtext">
      <div className="flex gap-3">
        <img
          src={profile.profilePic[0] ?? '/images/user-default.svg'}
          alt="profilepicture"
          className="size-12 rounded-full border"
        />
        <div className="w-full text-nowrap">
          <p className="text-lg">{profile.name}</p>
          <p className="text-sm text-caption">@{profile.username}</p>
        </div>

        <div className="flex w-full flex-col items-start text-nowrap">
          <p>has sent</p>
          <div className="flex items-center gap-1">
            <p>{convertToICP(parseInt(supporter.amount.toString()))} ICP</p>
            <img src="/images/icp.svg" alt="ICP Logo" className="h-4 w-4" />
          </div>
        </div>
      </div>

      <div className="mt-2 w-full">{supporter.supportComment}</div>
    </div>
  );
};

export default SupporterCard;
