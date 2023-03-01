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
import { auth } from "../../../FirebaseConfig"
import { useParams } from "react-router-dom";
import { handleFetch } from '../Utils'

export default function BookClubBanner(props) {
  let { bid } = useParams(); // clicked book
  let loggedinUser = JSON.parse(sessionStorage.loggedinUser);

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

  const fetchPostRecommendation = (jsonData) => {
    let url = "http://localhost:4567/api/recommend_book"
    fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jsonData)
    })
    .then((data) => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.log(error);
    });
  }

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
        fetchPostRecommendation(jsonData);
      })

      clearFormValues();
    }
  };


  // Save UnSave
  const handleFetchPostSaveStatus = (status, token) => {
    console.log(status)
    let url = "http://localhost:4567/api/" + status + "?token=" + token + "&book_key=" + props.bookData.book_id;
    console.log(url)
    fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then((data) => {
      console.log('Success:', data);
      handleFetch("get_saved_books?userID=", loggedinUser.uid).then((json) => {
        props.setIsBookSavedData(json.books.some(book => book.book_id === bid));
      });
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const handleSaveUnSaveBook = () => {
    auth.currentUser?.getIdToken(true).then(function(idToken) {
      if (props.isBookSavedData) {
        handleFetchPostSaveStatus("unsave_book", idToken);
      } else {
        handleFetchPostSaveStatus("save_book", idToken);
      }
    })
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