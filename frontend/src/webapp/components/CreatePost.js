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
import { tagsList } from './Constants';
import { handlePostFetch, hashUserIdToColor } from './Utils'

export default function CreatePost(props) {
  let loggedinUser = JSON.parse(sessionStorage.loggedinUser);

  const [showPostModal, setShowPostModal] = React.useState(false);
  const [bookClubId, setBookClubId] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [indexOfTagSelected, setIndexOfTagSelected] = React.useState(-1);
  const [isMissingFields, setIsMissingFields] = React.useState(true);
  const [isOverBodyLength, setIsOverBodyLength] = React.useState(false);
  const [isOverTitleLength, setIsOverTitleLength] = React.useState(false);

  React.useEffect(() => {
    setIsOverBodyLength(body.length > 1000);
    setIsOverTitleLength(title.length > 100);
    setIsMissingFields(bookClubId === "" || title === "" || body === "");
  }, [bookClubId, title, body]);

  const clearFormValues = () => {
    setBookClubId(props.isInBookClub ? props.bookClubs[0].book_key : "");
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

  const handlePost = () => {
    if (!isMissingFields && !isOverBodyLength && !isOverTitleLength) {
      setShowPostModal(false);

      auth.currentUser?.getIdToken(true).then(function(idToken) {

        let jsonData = {
          token: idToken,
          book_key: bookClubId,
          title: title,
          body: body,
          ...indexOfTagSelected > -1 && {tag: tagsList[indexOfTagSelected].label}
        }

        console.log("creating post", JSON.stringify(jsonData));

        handlePostFetch("make_post", jsonData).then(() => {
          props.setIsFetchPosts(!props.isFetchPosts);
        })

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
              sx={{ bgcolor: hashUserIdToColor(loggedinUser.uid), width: 50, height: 50, textDecoration: "none" }}
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
              onClick={() => {
                setBookClubId(props.isInBookClub ? props.bookClubs[0].book_key : bookClubId);
                setShowPostModal(true);
              }}
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
            {props.isInBookClub ?
              <TextField
                InputProps={{ disableUnderline: true }}
                disabled
                label="Book Club"
                variant="filled"
                value={props.bookClubs[0].title}
              /> :
              <FormControl size="small" variant="filled">
                <InputLabel required id="select-book-club-label">
                  Book Club
                </InputLabel>
                <Select
                  labelId="select-book-club-label"
                  value={bookClubId}
                  label="Book Club"
                  disableUnderline
                  onChange={(e) => setBookClubId(e.target.value)}
                >
                  {props.bookClubs === "" ?
                    <MenuItem /> :
                    Array.isArray(props.bookClubs) && props.bookClubs.length === 0 ? 
                      <MenuItem>
                        You haven't joined any book clubs yet
                      </MenuItem> :
                      props.bookClubs.map((bookClub, index) => {
                        return (
                          <MenuItem key={index} value={bookClub.book_key}>
                            {bookClub.title}
                          </MenuItem>
                        )
                      })
                  }
                </Select>
              </FormControl>
            }
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
                variant={
                  (isMissingFields || isOverBodyLength || isOverTitleLength) ? 'disabled': 'contained'
                }
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