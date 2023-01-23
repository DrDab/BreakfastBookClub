import React from 'react';
import Avatar from '@mui/material/Avatar';

export default function BookClubProfile() {
  let bookData = JSON.parse(sessionStorage.book)
  return (
    <>
      <Avatar
        variant="rounded"
        alt={bookData.title + " cover"}
        src={bookData.coverUrl}
        sx={{ width: 150, height: 200 }}
      />
      <h1>{bookData.title}</h1>
      <h3>{bookData.author}</h3>
    </>
  );
}