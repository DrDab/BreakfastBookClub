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
import { Link as RouterLink } from "react-router-dom";
import { tagsList, avatarColorMap} from './Constants';

export default function CreatePost() {
  let yourUserId = JSON.parse(sessionStorage.yourUser);
  let yourAuthToken = JSON.parse(sessionStorage.yourToken);
  let yourUser = yourUserId === 'EHDvyZymtRSbciB7uXHv1mN5O9r2' ? 'Amanda': yourUserId;

  const [showPostModal, setShowPostModal] = React.useState(false);
  const [bookClub, setBookClub] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [indexOfTagSelected, setIndexOfTagSelected] = React.useState(-1);
  const [isError, setIsError] = React.useState(true);

  let bookClubsJoinedData = [
    {title: "Animal Farm", key: "OL1168007W"},
    {title: "Nineteen Eighty-Four", key: "OL1168083W"},
    {title: "Homage to Catalonia", key: "OL1168169W"},
    {title: "George Orwell", key: "OL7968129W"}
  ];

  React.useEffect(() => {
    if (bookClub !== "" && title !== "" && body !== "") {
      setIsError(false);
    } else {
      setIsError(true);
    }
  }, [bookClub, title, body]);

  const clearFormValues = () => {
    setBookClub("");
    setTitle("");
    setBody("");
    setIndexOfTagSelected(-1);
    setIsError(true);
  }

  const handleCancelPost = () => {
    setShowPostModal(false);
    clearFormValues();
  };

  const handlePost = () => {
    if (!isError) {
      setShowPostModal(false);
      let jsonData = {
        token: yourAuthToken,
        book_key: bookClub,
        title: title,
        body: body,
        ...indexOfTagSelected > -1 && {tag: tagsList[indexOfTagSelected].label}
      }

      fetch('http://localhost:4567/api/make_post', {
        method: 'POST', 
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Success:', data);
        })
        .catch((error) => {
          console.log(error);
        });

      window.location.reload();
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
              to={"/user-profile/" + yourUserId}
              sx={{ bgcolor: avatarColorMap.get(yourUser), width: 50, height: 50, textDecoration: "none" }}
              aria-label={yourUser + " avatar"}
            >
             {yourUser.charAt(0)}
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
              <Button disableElevation size="small" variant={isError ? 'disabled': 'contained'} onClick={handlePost}>
                Post
              </Button>
              <Button disableElevation size="small" variant='outlined' onClick={handleCancelPost}>
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}