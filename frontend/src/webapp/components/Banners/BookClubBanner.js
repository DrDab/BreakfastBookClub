import React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { auth } from "../../../FirebaseConfig";
import { handlePostFetch } from '../Utils';

export default function BookClubBanner(props) {
  const [showRecomendModal, setShowRecomendModal] = React.useState(false);
  const [selectFriendUserId, setSelectFriendUserId] = React.useState('');
  const [isMissingFields, setIsMissingFields] = React.useState(true);

  // Recommendations
  React.useEffect(() => {
    setIsMissingFields(selectFriendUserId === "");
  }, [selectFriendUserId]);

  const clearFormValues = () => {
    setSelectFriendUserId("");
    setIsMissingFields(true);
  }

  const handleCancelRecommendation = () => {
    setShowRecomendModal(false);
    clearFormValues();
  };

  const handleSendRecommendation = () => {
    if (!isMissingFields) {
      setShowRecomendModal(false);

      auth.currentUser?.getIdToken(true).then(function(idToken){
        let jsonData = {
          token: idToken,
          book_key: props.bookData.book_id,
          recipient_userId: selectFriendUserId
        }
        console.log("post rec", jsonData)
        handlePostFetch("recommend_book", jsonData);
      })
      clearFormValues();
    }
  };


  // Save UnSave
  const handleSaveUnSaveBook = () => {
    auth.currentUser?.getIdToken(true).then(function(idToken) {
      if (props.isBookSavedData) {
        handlePostFetch("unsave_book?token=" + idToken + "&book_key=" + props.bookData.book_id, "");
      } else {
        handlePostFetch("save_book?token=" + idToken + "&book_key=" + props.bookData.book_id, "");
      }
    })
    props.setIsBookSavedData(!props.isBookSavedData);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={30}>
          <Grid item xs={2}>
            <Avatar
              variant="rounded"
              alt={props.bookData.title + " cover"}
              src={props.bookData.thumbnail}
              sx={{ width: 150, height: 200 }}
            />
          </Grid>
          <Grid item xs={8}>
            <Stack spacing={3}>
              <Typography variant="h5">
                {props.bookData.title}
              </Typography>
              <Typography variant="p1">
                {props.bookData.author}
              </Typography>
              <Stack spacing={2} direction="row">
                <Button
                  disableElevation
                  variant={props.isBookSavedData ? "outlined" : "contained"}
                  onClick={handleSaveUnSaveBook}
                >
                  {props.isBookSavedData ? "Unsave" : "Save"} 
                </Button>
                <Button disableElevation variant="outlined" size="small" onClick={() => setShowRecomendModal(true)}> 
                  Recommend
                </Button>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Box>
      <Modal
        open={showRecomendModal}
        onClose={() => setShowRecomendModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="basic-modal recommend-modal">
          <Stack spacing={2}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {"Recommend " + props.bookData.title + " to"}
            </Typography>
            <FormControl size="small" variant="filled">
              <InputLabel required id="select-friend-label">Friend</InputLabel>
              <Select
                labelId="select-friend-label"
                value={selectFriendUserId}
                label="Friend"
                disableUnderline
                onChange={(e) => setSelectFriendUserId(e.target.value)}
              >
                <MenuItem value="">
                  <em>Choose Friend</em>
                </MenuItem>
                {props.loggedinUserFriendsData !== "" ?
                  props.loggedinUserFriendsData.map((friend, index) => {
                    return (<MenuItem key={index} value={friend.uid}>{friend.username}</MenuItem>)
                  })
                  : <></>
                }
              </Select>
            </FormControl>
            <Stack justifyContent="end" direction="row" spacing={1}>
              <Button
                disableElevation
                size="small"
                variant={isMissingFields ? 'disabled': 'contained'}
                onClick={handleSendRecommendation}>
                Send
              </Button>
              <Button disableElevation size="small" variant='outlined' onClick={handleCancelRecommendation}>
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}