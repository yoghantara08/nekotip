import React from 'react'



const ProfileCard = () => {
  return (
    <div className='w-fit h-72'>
      <div className='bg-FEC2C3 h-72 rounded-xl shadow-shadow shadow-custom'>
        <img src="/images/profile-border.png" alt="profile-upper" />
        <span className='absolute translate-x-40 -translate-y-6 bg-white rounded-md px-2 text-xs'>Streaming</span>
        <img src="/images/profile-pic.png" alt="profile-picture" className='translate-x-6 -translate-y-14'/>
        <div className='font-semibold text-xl ml-6 -mt-11'>PHANTOM</div>
        <div className='ml-6 text-4E4C47 text-sm'>@phantomaru</div>
        <div className='mt-1 ml-6 text-xs w-40 text-4E4C47' >Cosplayer, Virtual Streamer, Love Anime </div>
      </div>
    </div>
  )
}

export default ProfileCard