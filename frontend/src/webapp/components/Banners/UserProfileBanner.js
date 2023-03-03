import React from 'react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import PeopleList from '../Lists/PeopleList';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { handleGetFetch, handlePostFetch, hashUserIdToColor } from '../Utils';
import { auth } from "../../../FirebaseConfig"
import { useParams } from "react-router-dom";

export default function UserProfileBanner(props) {
  let loggedinUser = JSON.parse(sessionStorage.loggedinUser);
  let { uid } = useParams(); // clicked user

  const [showFriendsModal, setShowFriendsModal] = React.useState(false);
  const [showEditBioModal, setShowEditBioModal] = React.useState(false);
  const [bio, setBio] = React.useState(props.clickedUserData.bio? props.clickedUserData.bio : "");
  const [isOverBioLength, setIsOverBioLength] = React.useState(false);

  React.useEffect(() => {
    setIsOverBioLength(bio.length > 1000);
  },[bio]);

  const clearFormValues = () => {
    setBio(props.clickedUserData.bio? props.clickedUserData.bio : "");
    setIsOverBioLength(false);
  }

  const handleCancelEdit = () => {
    setShowEditBioModal(false);
    clearFormValues();
  };

  const handleEditProfile = () => {
    if (!isOverBioLength) {
      setShowEditBioModal(false);
      auth.currentUser?.getIdToken(true).then(function(idToken){
        handlePostFetch("update_user?token=" + idToken + "&bio=" + bio, "").then(() => {
          handleGetFetch("get_user?userId=" + uid).then((json) => {
            props.setUserProfileData(json.user);
          });
        })
      })
      clearFormValues();
    }
  };

  const handleAddRemoveFriend = () => {
    auth.currentUser?.getIdToken(true).then(function(idToken){
      if (props.isFriendData) {
        handlePostFetch("remove_friend?token=" + idToken + "&friend_userId=" + props.clickedUserData.uid, "").then(() => {
          handleGetFetch("list_friends?user_id=" + props.clickedUserData.uid).then((json) => {
            props.setFriendsData(json.friends);
          });
        })
      } else {
        handlePostFetch("add_friend?token=" + idToken + "&friend_userId=" + props.clickedUserData.uid, "").then(() => {
          handleGetFetch("list_friends?user_id=" + props.clickedUserData.uid).then((json) => {
            props.setFriendsData(json.friends);
          });
        })
      }
      props.setIsFriendData(!props.isFriendData);
    })
  };

  return (
    <>
    {props.clickedUserData !== "" &&
      <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={30}>
          <Grid item xs={2}>
            <Avatar
              alt={props.clickedUserData.username + " avatar"}
              sx={{ bgcolor: hashUserIdToColor(props.clickedUserData.uid), width: 150, height: 150 }}
            >
              {props.clickedUserData.username.charAt(0).toUpperCase()}
            </Avatar>
          </Grid>
          <Grid item xs={8}>
            <Stack spacing={3}>
              <Typography variant="h5">{props.clickedUserData.username}</Typography>
              <Stack spacing={2} direction="row">
                {props.clickedUserData.uid === loggedinUser.uid?
                  <Button
                    disableElevation
                    variant="contained"
                    size="small"
                    onClick={() => setShowEditBioModal(true)}
                  >
                    Edit Profile
                  </Button>:
                  <Button
                    disableElevation
                    variant={props.isFriendData ? "outlined" : "contained"}
                    size="small"
                    onClick={handleAddRemoveFriend}
                  >
                    {props.isFriendData ? "Remove Friend" : "Add Friend"}
                  </Button>
                }
                <Button
                  disableElevation
                  variant="outlined"
                  size="small"
                  onClick={() => setShowFriendsModal(true)}
                >
                  {props.clickedUserFriendsData.length + " Friends"}
                </Button>
              </Stack>
              <Typography>
                {props.clickedUserData.bio ? props.clickedUserData.bio : ""}
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
          <PeopleList peopleData={props.clickedUserFriendsData}/>
        </Box>
      </Modal>

      <Modal
        open={showEditBioModal}
        onClose={() => setShowEditBioModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="basic-modal edit-bio-modal">
          <Stack spacing={2}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Edit Profile
            </Typography>
            <TextField
              InputProps={{ disableUnderline: true }}
              required
              label="Bio"
              multiline
              rows="4"
              variant="filled"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              error={isOverBioLength}
              helperText={isOverBioLength ? "Over character limit of 1000": ""}
            />
            <Stack justifyContent="end" direction="row" spacing={1}>
              <Button
                disableElevation
                size="small"
                variant={isOverBioLength ? 'disabled': 'contained'}
                onClick={handleEditProfile}
              >
                Save
              </Button>
              <Button
                disableElevation
                size="small"
                variant='outlined'
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
      </>
    }
    </>
  );
}