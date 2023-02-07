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
import { red } from '@mui/material/colors';
import { Link as RouterLink } from "react-router-dom";
import { tagsList } from './Constants';

export default function CreatePost() {
  const [showPostModal, setShowPostModal] = React.useState(false);
  const [bookClub, setBookClub] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [thoughts, setThoughts] = React.useState("");
  const [indexOfTagSelected, setIndexOfTagSelected] = React.useState(-1);

  let yourUser = JSON.parse(sessionStorage.yourUser);

  let bookClubsJoinedData = [
    {title: "Harry Potter"},
    {title: "Twilight"},
    {title: "Wonder"}
  ];

  const clearFormValues = () => {
    setBookClub("");
    setTitle("");
    setThoughts("");
    setIndexOfTagSelected(-1);
  }

  const handleCancelPost = () => {
    setShowPostModal(false);
    clearFormValues();
  };

  const handlePost = () => {
    setShowPostModal(false);
    console.log("sending to API", {bookClub, title, thoughts,indexOfTagSelected})
    clearFormValues();
  };

  return (
    <>
      <Card elevation={0} className="main-feed-post">
        <CardContent>
          <Stack direction="row" spacing={2}>
            <Avatar
              component={RouterLink}
              to={"/user-profile/" + yourUser}
              sx={{ bgcolor: red[500], width: 50, height: 50, textDecoration: "none" }}
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
                    <MenuItem key={index} value={bookClub.title}>
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
              value={thoughts}
              onChange={(e) => setThoughts(e.target.value)}
            />
            <Stack direction="row" spacing={1}>
              {tagsList.map((tag, index) => {
                return (
                  <Chip
                    variant= {indexOfTagSelected === index ? "filled": "outlined"}
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
              <Button disableElevation size="small" variant='contained' onClick={handlePost}>
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