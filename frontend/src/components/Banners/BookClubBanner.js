import React from 'react';
import Avatar from '@mui/material/Avatar';

export default function BookClubBanner(props) {
  
  return (
    <>
      <Avatar
        variant="rounded"
        alt={props.bookData.title + " cover"}
        src={props.bookData.coverUrl}
        sx={{ width: 150, height: 200 }}
      />
      <h1>{props.bookData.title}</h1>
      <h3>{props.bookData.author}</h3>
    </>
  );
}