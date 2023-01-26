import React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { red } from '@mui/material/colors';
import { useNavigate} from "react-router-dom";
import { goToUserProfile } from '../Utils'
import { tagsList } from '../Constants';
import { CustomFormControl } from '../Inputs/CustomFormControl';
import { CustomTextField } from '../Inputs/CustomTextField';

export default function CreatePost() {
  const [showPostModal, setShowPostModal] = React.useState(false);
  const [indexOfTagSelected, setIndexOfTagSelected] = React.useState(-1);
  const [bookClub, setBookClub] = React.useState('');

  const navigate = useNavigate();
  let yourUser = JSON.parse(sessionStorage.yourUser);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    boxShadow: 24,
    outline: 'none',
    p: 4,
  };

  let bookClubsJoinedData = [
    {title: "Harry Potter"}, 
    {title: "Twilight"},
    {title: "Wonder"}
  ];

  return (
    <>
      <Card elevation={0} className="main-feed-post">
        <CardContent>
          <Stack direction="row" spacing={2}>
            <Avatar 
              sx={{ bgcolor: red[500],width: 50, height: 50 }}
              aria-label={yourUser + " avatar"}
              onClick={() => goToUserProfile(yourUser, navigate)}
            >
             {yourUser.charAt(0)}
            </Avatar>
            <TextField
              disabled
              id="outlined-disabled"
              label="Write a post"
              fullWidth={true} 
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
        <Box sx={style}>
          <Stack spacing={2}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Create Post
            </Typography>
            <CustomFormControl sx={{ width:'50%' }} size="small" variant="filled">
              <InputLabel required id="select-book-club-label">Book Club</InputLabel>
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
                  return (<MenuItem key={index} value={bookClub.title}>{bookClub.title}</MenuItem>)
                })}
              </Select>
            </CustomFormControl>
            <CustomTextField
              required
              label="Title"
              variant="filled"
            />
            <CustomTextField
              required
              label="Thoughts"
              multiline
              rows="4"
              variant="filled"
            />
            <Stack direction="row" spacing={1}>
              {tagsList.map((tag, index) => {
                return (
                  <Chip
                  variant= {indexOfTagSelected === index ? "filled": "outlined" }
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
              <Button size="small" variant='contained'>
                Post
              </Button>
              <Button size="small" variant='outlined' onClick={() => setShowPostModal(false)}>
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}