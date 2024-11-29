import { useState } from 'react';

import { ChevronDown, SaveIcon } from 'lucide-react';

import Button from '@/components/ui/Button/Button';
import CustomDropdown from '@/components/ui/Dropdown/CustomDropdown';
import { CustomInput } from '@/components/ui/Input/CustomInput';
import { CustomTextarea } from '@/components/ui/Input/CustomTextarea';
import { CATEGORIES } from '@/constant/common';
import useUser from '@/hooks/useUser';
import { useAuthManager } from '@/store/AuthProvider';

import { Socials } from '../../../../../declarations/nekotip_backend/nekotip_backend.did';

import ChangeBannerProfile from './ChangeBannerProfile';
import ChangeProfilePic from './ChangeProfilePic';

const SOCIAL_PLATFORMS: Array<keyof Socials> = [
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
  const { user, updateUser } = useUser();
  const { actor } = useAuthManager();

  const [name, setName] = useState(user?.name);
  const [username, setUsername] = useState(user?.username);
  const [bio, setBio] = useState(user?.bio);
  const [category, setCategory] = useState<string[]>(user?.categories ?? []);
  const [socials, setSocials] = useState<Socials>({
    twitter: user?.socials?.twitter ?? [],
    instagram: user?.socials?.instagram ?? [],
    tiktok: user?.socials?.tiktok ?? [],
    youtube: user?.socials?.youtube ?? [],
    twitch: user?.socials?.twitch ?? [],
    facebook: user?.socials?.facebook ?? [],
    discord: user?.socials?.discord ?? [],
    website: user?.socials?.website ?? [],
  });
  const [loading, setLoading] = useState(false);

  const categoriesOptions = CATEGORIES.map((category) => ({
    label: category,
  }));

  const handleSocialChange = (platform: keyof Socials, value: string[]) => {
    setSocials((prev) => ({
      ...prev,
      [platform]: value || null,
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      const categories: [] | [string[]] = category.length > 0 ? [category] : [];

      if (actor) {
        const result = await actor.updateUserProfile({
          bio: bio ? [bio] : [],
          categories: categories,
          username: username ? [username] : [],
          name: name ? [name] : [],
          socials: [socials],
          bannerPic: [],
          profilePic: [],
        });

        if ('ok' in result) {
          updateUser(result.ok);
        } else {
          console.error('Error updating profile', result.err);
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3 flex flex-col gap-6 xl:flex-row">
      <div className="rounded-lg border border-border px-5 py-4 shadow-custom">
        {/* PICTURE */}
        <ChangeProfilePic />
        <ChangeBannerProfile />

        {/* PROFILE */}
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <CustomInput
              containerClassName="w-full"
              label="Name"
              value={name ?? ''}
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
            value={bio ?? ''}
            placeholder={'Tell about yourself'}
            onChange={(e) => setBio(e.target.value)}
            maxLength={100}
          />
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <div className="min-w-[300px] space-y-3 rounded-lg border border-border px-5 py-4 shadow-custom">
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
            onItemClick={(item) => setCategory([item.label])}
            className="w-full"
          />
          {/* SOCIALS */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {SOCIAL_PLATFORMS.map((platform) => (
              <CustomInput
                key={platform}
                label={platform.charAt(0).toUpperCase() + platform.slice(1)}
                value={socials[platform] ?? ''}
                placeholder={`Your ${platform} link`}
                onChange={(e) => handleSocialChange(platform, [e.target.value])}
                inputClassName="text-sm md:text-lg"
              />
            ))}
          </div>
        </div>
        <Button
          disabled={loading}
          icon={<SaveIcon />}
          variant="secondary"
          onClick={handleUpdateProfile}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default EditProfile;
