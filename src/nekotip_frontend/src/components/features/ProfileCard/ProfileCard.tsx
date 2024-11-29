import React from 'react';

const ProfileCard = () => {
  return (
    <div className="h-72 w-fit">
      <div className="h-72 rounded-xl bg-FEC2C3 shadow-custom shadow-shadow">
        <img src="/images/profile-border.png" alt="profile-upper" />
        <span className="absolute -translate-y-6 translate-x-40 rounded-md bg-white px-2 text-xs">
          Streaming
        </span>
        <img
          src="/images/profile-pic.png"
          alt="profile-picture"
          className="-translate-y-14 translate-x-6"
        />
        <div className="-mt-11 ml-6 text-xl font-semibold">PHANTOM</div>
        <div className="ml-6 text-sm text-4E4C47">@phantomaru</div>
        <div className="ml-6 mt-1 w-40 text-xs text-4E4C47">
          Cosplayer, Virtual Streamer, Love Anime{' '}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
