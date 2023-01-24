import React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';

export default function UserProfileBanner() {
  let clickedUserData = JSON.parse(sessionStorage.clickedUser)
  let yourUserData = JSON.parse(sessionStorage.yourUser)
  return (
    <>
      <Avatar
        alt={clickedUserData + " cover"}
        sx={{ width: 100, height: 100 }}
      >
      {clickedUserData.charAt(0)}
      </Avatar>
      <h1>{clickedUserData}</h1>
      {clickedUserData === yourUserData? <Button>Edit Profile</Button>: <></> }
    </>
  );
}