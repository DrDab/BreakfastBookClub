import React from 'react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import PeopleList from '../Lists/PeopleList';
import Grid from '@mui/material/Grid';


export default function UserProfileBanner(props) {
  let yourUserData = JSON.parse(sessionStorage.yourUser)
  const [showFriendsModal, setShowFriendsModal] = React.useState(false);

  return (
    <>
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={30}>
        <Grid item xs={2}>
          <Avatar alt={props.clickedUserData + " avatar"} sx={{ width: 150, height: 150 }}>
            {props.clickedUserData.charAt(0)}
          </Avatar>
        </Grid>
        <Grid item xs={8}>
          <Stack spacing={3}>
            <Typography variant="h5">{props.userData}</Typography>
            <Stack spacing={2} direction="row">
              {props.clickedUserData === yourUserData? <Button variant="contained" size="small">Edit Profile</Button>: <Button variant="contained" size="small">Add Friend</Button>} 
              <Button variant="outlined" size="small" onClick={() => setShowFriendsModal(true)}>{888 + " Friends"}</Button>
            </Stack>
            <Typography>I walked through the door with you, the air was cold. One for the money, two for the show I never was ready, so I watch you go.</Typography>          </Stack>
        </Grid>
      </Grid>
    </Box>
    <Modal
      open={showFriendsModal}
      onClose={() => setShowFriendsModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="basic-modal friends-list-modal">
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Friends
        </Typography>
        <PeopleList peopleData={props.friendsData}/>
      </Box>
    </Modal>
    </>
  );
}