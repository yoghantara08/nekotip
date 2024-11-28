import React, { useState } from 'react';

import Button from '@/components/ui/Button/Button';
import CustomFileInput from '@/components/ui/Input/CustomFIleInput';
import ModalCustom from '@/components/ui/Modal/ModalCustom';
import useUploadImage from '@/hooks/useUploadImage';
import useUser from '@/hooks/useUser';
import useWindowSize from '@/hooks/useWindowSize';
import { useAuthManager } from '@/store/AuthProvider';

const ChangeProfilePic = () => {
  const { user, updateUser } = useUser();
  const { isMobile } = useWindowSize();
  const {
    preview,
    handleFileChange,
    resetUpload,
    uploadError,
    uploadImage,
    selectedFile,
  } = useUploadImage();
  const { actor } = useAuthManager();

  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUploadImage = async () => {
    try {
      setLoading(true);
      const url = await uploadImage();

      if (url && actor) {
        const result = await actor.updateUserProfile({
          profilePic: [url],
          bio: [],
          categories: [],
          username: [],
          name: [],
          socials: [],
          bannerPic: [],
        });

        if ('ok' in result) {
          updateUser(result.ok);
          setOpenModal(false);
        } else {
          console.error('Error updating profile', result.err);
        }
      } else {
        console.error('Error uploading image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2 md:gap-4">
        <h3 className="font-semibold text-subtext md:text-lg">
          Profile Picture
        </h3>
        <div className="flex size-20 items-center justify-center overflow-hidden rounded-full border border-border md:size-32">
          <img
            src={user?.profilePic ?? '/images/logo/nekotip.svg'}
            alt="profile"
            className="h-full w-full object-cover"
          />
        </div>
        <Button
          className="w-fit"
          shadow={false}
          size={isMobile ? 'small' : 'default'}
          onClick={() => setOpenModal(true)}
        >
          Upload New Picture
        </Button>
      </div>
      <ModalCustom
        title="Upload Avatar"
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        className="max-w-[450px]"
        disableClose={loading}
      >
        <div className="flex flex-col items-center gap-4 p-5">
          <div className="size-36 overflow-hidden rounded-full bg-bg">
            <img
              src={preview || user?.profilePic || '/images/user-default.svg'}
              alt="profilepic"
              className="h-full w-full object-cover"
            />
          </div>
          <CustomFileInput
            onChange={handleFileChange}
            value={selectedFile}
            error={uploadError}
            accept="image/png,image/jpeg,image/gif"
            containerClassName="w-fit"
            className="bg-transparent"
            handleRemove={resetUpload}
          />
          <Button
            disabled={selectedFile === null || loading}
            className="w-full"
            onClick={handleUploadImage}
          >
            {loading ? 'Uploading...' : 'Save'}
          </Button>
        </div>
      </ModalCustom>
    </>
  );
};

export default ChangeProfilePic;
