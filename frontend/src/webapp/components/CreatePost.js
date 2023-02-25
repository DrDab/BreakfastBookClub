import React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { auth } from "../../FirebaseConfig"
import { Link as RouterLink } from "react-router-dom";
import { tagsList, avatarColorMap } from './Constants';

export default function CreatePost() {
  let loggedinUser = JSON.parse(sessionStorage.loggedinUser);


  const [showPostModal, setShowPostModal] = React.useState(false);
  const [bookClub, setBookClub] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [indexOfTagSelected, setIndexOfTagSelected] = React.useState(-1);
  const [isMissingFields, setIsMissingFields] = React.useState(true);
  const [isOverBodyLength, setIsOverBodyLength] = React.useState(false);
  const [isOverTitleLength, setIsOverTitleLength] = React.useState(false);


  let bookClubsJoinedData = [
    {title: "Animal Farm", key: "OL1168007W"},
    {title: "Nineteen Eighty-Four", key: "OL1168083W"},
    {title: "Homage to Catalonia", key: "OL1168169W"},
    {title: "George Orwell", key: "OL7968129W"}
  ];

  React.useEffect(() => {
    setIsOverBodyLength(body.length > 1000);
    setIsOverTitleLength(title.length > 100);
    setIsMissingFields(bookClub === "" || title === "" || body === "");
  }, [bookClub, title, body]);

  const clearFormValues = () => {
    setBookClub("");
    setTitle("");
    setBody("");
    setIndexOfTagSelected(-1);
    setIsMissingFields(true);
    setIsOverBodyLength(false);
  }

  const handleCancelPost = () => {
    setShowPostModal(false);
    clearFormValues();
  };

  const fetchPost = (jsonData) => {
    let url = "http://localhost:4567/api/make_post";
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
      window.location.reload();
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const handlePost = () => {
    if (!isMissingFields && !isOverBodyLength && !isOverTitleLength) {
      setShowPostModal(false);

      auth.currentUser?.getIdToken(true).then(function(idToken){
        let jsonData = {
          token: idToken,
          book_key: bookClub,
          title: title,
          body: body,
          ...indexOfTagSelected > -1 && {tag: tagsList[indexOfTagSelected].label}
        }
        sessionStorage.setItem("sendingPost", JSON.stringify(jsonData));
        fetchPost(jsonData);
      })

      clearFormValues();
    }
  };

  return (
    <>
      <Card elevation={0} className="main-feed-post">
        <CardContent>
          <Stack direction="row" spacing={2}>
            <Avatar
              reloadDocument
              component={RouterLink}
              to={"/user-profile/" + loggedinUser.uid}
              sx={{ bgcolor: avatarColorMap.get(loggedinUser.username), width: 50, height: 50, textDecoration: "none" }}
              aria-label={loggedinUser.username + " avatar"}
            >
             {loggedinUser.username.charAt(0)}
            </Avatar>
            <TextField
              InputProps={{ disableUnderline: true }}
              disabled
              fullWidth
              label="Write a post"
              variant="filled"
              onClick={() => setShowPostModal(true)}
            />
          </Stack>
        </CardContent>
      </Card>
      <Modal
        open={showPostModal}
        onClose={() => setShowPostModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="basic-modal create-post-modal">
          <Stack spacing={2}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Create Post
            </Typography>
            <FormControl size="small" variant="filled">
              <InputLabel required id="select-book-club-label">
                Book Club
              </InputLabel>
              <Select
                labelId="select-book-club-label"
                value={bookClub}
                label="Book Club"
                disableUnderline
                onChange={(e) => setBookClub(e.target.value)}
              >
                <MenuItem value="">
                  <em>Choose Book Club</em>
                </MenuItem>
                {bookClubsJoinedData.map((bookClub, index) => {
                  return (
                    <MenuItem key={index} value={bookClub.key}>
                      {bookClub.title}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
            <TextField
              InputProps={{ disableUnderline: true }}
              required
              label="Title"
              variant="filled"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={isOverTitleLength}
              helperText={isOverTitleLength ? "Over character limit of 100": ""}
            />
            <TextField
              InputProps={{ disableUnderline: true }}
              required
              label="Thoughts"
              multiline
              rows="4"
              variant="filled"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              error={isOverBodyLength}
              helperText={isOverBodyLength ? "Over character limit of 1000": ""}
            />
            <Stack direction="row" spacing={1}>
              {tagsList.map((tag, index) => {
                return (
                  <Chip
                    variant={indexOfTagSelected === index ? "filled": "outlined"}
                    key={index}
                    icon={tag.icon}
                    label={tag.label}
                    color={tag.color}
                    onClick={() => setIndexOfTagSelected(indexOfTagSelected === index ? -1 : index)}
                  />
                )
              })}
            </Stack>
            <Stack justifyContent="end" direction="row" spacing={1}>
              <Button 
                disableElevation
                size="small"
                variant={(isMissingFields || isOverBodyLength || isOverTitleLength) ? 'disabled': 'contained'}
                onClick={handlePost}
              >
                Post
              </Button>
              <Button 
                disableElevation
                size="small"
                variant='outlined'
                onClick={handleCancelPost}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}