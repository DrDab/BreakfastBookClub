import React from 'react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

export default function UserProfileBanner(props) {
  return (
    <>
      <Stack
        direction="row"
        spacing={2}
      >
      <Box>      
        <Avatar
          alt={props.userData + " avatar"}
          sx={{ width: 100, height: 100 }}
        >
          {props.userData.charAt(0)}
        </Avatar>
        <h1>{props.userData}</h1>
      </Box>
      <Box sx={{padding: '0rem 5rem', display: 'flex', alignItems: 'center'}}>
        <span>I walked through the door with you, the air was cold But somethin' 'bout it felt like home somehow And I left my scarf there at your sister's house And you've still got it in your drawer, even now</span> 
      </Box>
    </Stack>
    </>
  );
}