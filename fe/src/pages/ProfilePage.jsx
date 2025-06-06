import React from 'react';
import { useAuthStore } from '../store/useAuthStore';

const ProfilePage = () => {
  const { authUser } = useAuthStore();

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-24 h-24 mb-4">
        <img
          src={authUser?.image || 'https://avatar.iran.liara.run/public/boy'}
          alt="User Avatar"
          className="object-cover w-full h-full rounded-full"
        />
      </div>
      <h1 className="text-xl font-semibold">{authUser?.name || 'User Name'}</h1>
    </div>
  );
};

export default ProfilePage;

