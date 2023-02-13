import React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

export default function BookClubBanner(props) {
  const [showRecomendModal, setShowRecomendModal] = React.useState(false);
  const [friend, setFriend] = React.useState('');

  let friendsData = [
    {name: "Andrea"},
    {name: "Zaynab"},
    {name: "Sanjana"},
    {name: "Jocelyn"}
  ];
  
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={30}>
          <Grid item xs={2}>
            <Avatar
              variant="rounded"
              alt={props.bookData.title + " cover"}
              src={props.bookData.coverUrl}
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
                <Button disableElevation variant="contained" size="small">
                  Save
                </Button>
                <Button disableElevation variant="outlined" size="small" onClick={() => setShowRecomendModal(true)}> 
                  Recommend
                </Button>
              </Stack>
              <Typography>
                I walked through the door with you, the air was cold. One for the money, two for the show I never was ready, so I watch you go.
              </Typography>
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
              Recommend to
            </Typography>
            <FormControl size="small" variant="filled">
              <InputLabel required id="select-friend-label">Friend</InputLabel>
              <Select
                labelId="select-friend-label"
                value={friend}
                label="Friend"
                disableUnderline
                onChange={(e) => setFriend(e.target.value)}
              >
                <MenuItem value="">
                  <em>Choose Friend</em>
                </MenuItem>
                {friendsData.map((friend, index) => {
                  return (<MenuItem key={index} value={friend.name}>{friend.name}</MenuItem>)
                })}
              </Select>
            </FormControl>
            <TextField
              InputProps={{ disableUnderline: true }}
              required
              label="Thoughts"
              multiline
              rows="4"
              variant="filled"
            />
            <Stack justifyContent="end" direction="row" spacing={1}>
              <Button disableElevation size="small" variant="contained">
                Send
              </Button>
              <Button disableElevation size="small" variant='outlined' onClick={() => setShowRecomendModal(false)}>
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}