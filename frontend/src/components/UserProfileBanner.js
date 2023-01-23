import React from 'react';
import Avatar from '@mui/material/Avatar';

export default function UserProfileBanner() {
  let userData = JSON.parse(sessionStorage.otherUser)
  return (
    <>
      <Avatar
        alt={userData + " cover"}
        sx={{ width: 100, height: 100 }}
      >
      {userData.charAt(0)}
      </Avatar>
      <h1>{userData}</h1>
    </>
  );
}