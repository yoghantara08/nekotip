import { useState } from 'react';

import { ChevronDown, SaveIcon } from 'lucide-react';

import Button from '@/components/ui/Button/Button';
import CustomDropdown from '@/components/ui/Dropdown/CustomDropdown';
import { CustomInput } from '@/components/ui/Input/CustomInput';
import { CustomTextarea } from '@/components/ui/Input/CustomTextarea';
import { CATEGORIES } from '@/constant/common';
import useUser from '@/hooks/useUser';
import { ISocials } from '@/types/user.types';

import ChangeBannerProfile from './ChangeBannerProfile';
import ChangeProfilePic from './ChangeProfilePic';

const SOCIAL_PLATFORMS: Array<keyof ISocials> = [
  'twitter',
  'instagram',
  'tiktok',
  'youtube',
  'twitch',
  'facebook',
  'discord',
  'website',
];

const EditProfile = () => {
  const { user } = useUser();

  const [name, setName] = useState(user?.name ?? '');
  const [username, setUsername] = useState(user?.username ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [category, setCategory] = useState<string[]>(user?.categories ?? []);
  const [socials, setSocials] = useState<ISocials>({
    twitter: user?.socials?.twitter ?? null,
    instagram: user?.socials?.instagram ?? null,
    tiktok: user?.socials?.tiktok ?? null,
    youtube: user?.socials?.youtube ?? null,
    twitch: user?.socials?.twitch ?? null,
    facebook: user?.socials?.facebook ?? null,
    discord: user?.socials?.discord ?? null,
    website: user?.socials?.website ?? null,
  });

  const categoriesOptions = CATEGORIES.map((category) => ({
    label: category,
  }));

  const handleSocialChange = (platform: keyof ISocials, value: string) => {
    setSocials((prev) => ({
      ...prev,
      [platform]: value || null,
    }));
  };

  return (
    <div className="mt-3 flex flex-col gap-6 xl:flex-row">
      <div className="rounded-lg border border-border px-5 py-4 shadow-custom">
        {/* PICTURE */}
        <div className="flex flex-col gap-3 md:gap-6 xxl:flex-row">
          <ChangeProfilePic />
          <ChangeBannerProfile />
        </div>
        {/* PROFILE */}
        <div className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <CustomInput
              containerClassName="w-full"
              label="Name"
              value={name}
              placeholder={'Your name'}
              onChange={(e) => setName(e.target.value)}
            />
            <CustomInput
              containerClassName="w-full"
              label="Username"
              value={username}
              placeholder={'Your creator tag'}
              onChange={(e) => setUsername(e.target.value)}
              prefix="@"
            />
          </div>
          {/* BIO */}
          <CustomTextarea
            textareaClassName="md:h-[100px]"
            label="Bio"
            value={bio}
            placeholder={'Tell about yourself'}
            onChange={(e) => setBio(e.target.value)}
            maxLength={100}
          />
          {/* CATEGORY */}
          <p className="-mb-2 text-lg font-semibold text-subtext">Category</p>
          <CustomDropdown
            triggerContent={
              <div className="flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left font-medium text-subtext">
                {category.length > 0 ? (
                  category
                ) : (
                  <span className="text-caption">Select Category</span>
                )}
                <ChevronDown />
              </div>
            }
            options={categoriesOptions}
            onItemClick={(item) => setCategory([item?.label ?? ''])}
          />
        </div>
      </div>
      <div className="flex flex-col gap-6">
        {/* SOCIALS */}
        <div className="grid min-h-[300px] grid-cols-2 gap-x-4 gap-y-2 rounded-lg border border-border px-5 py-4 shadow-custom">
          {SOCIAL_PLATFORMS.map((platform) => (
            <CustomInput
              key={platform}
              label={platform.charAt(0).toUpperCase() + platform.slice(1)}
              value={socials[platform] ?? ''}
              placeholder={`Your ${platform} link`}
              onChange={(e) => handleSocialChange(platform, e.target.value)}
            />
          ))}
        </div>
        <Button icon={<SaveIcon />} variant="secondary">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default EditProfile;
