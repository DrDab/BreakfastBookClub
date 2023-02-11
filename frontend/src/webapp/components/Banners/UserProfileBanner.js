import React from 'react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import PeopleList from '../Lists/PeopleList';
import Grid from '@mui/material/Grid';
import { avatarColorMap } from '../Constants';

export default function UserProfileBanner(props) {
  let yourUserId = JSON.parse(sessionStorage.yourUser);
  const [showFriendsModal, setShowFriendsModal] = React.useState(false);

  return (
    <>
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={30}>
        <Grid item xs={2}>
          <Avatar 
            alt={props.clickedUserData.username + " avatar"}
            sx={{ bgcolor: avatarColorMap.get(props.clickedUserData.username), width: 150, height: 150 }}
            // src={props.clickedUserData.thumbnail}
          >
             {props.clickedUserData.username.charAt(0)}
          </Avatar>
        </Grid>
        <Grid item xs={8}>
          <Stack spacing={3}>
            <Typography variant="h5">{props.clickedUserData.username}</Typography>
            <Stack spacing={2} direction="row">
              {props.clickedUserData.userId === yourUserId?
                <Button disableElevation variant="contained" size="small">
                  Edit Profile
                </Button>:
                <Button disableElevation variant="contained" size="small">
                  Add Friend
                </Button>
              } 
              <Button 
                disableElevation variant="outlined" size="small" onClick={() => setShowFriendsModal(true)}
              >
                {888 + " Friends"}
              </Button>
            </Stack>
            <Typography>
              {props.clickedUserData.bio}
            </Typography> 
          </Stack>
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