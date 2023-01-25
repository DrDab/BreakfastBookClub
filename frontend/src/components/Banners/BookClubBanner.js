import React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';

export default function BookClubBanner(props) {
  const [showRecomendModal, setShowRecomendModal] = React.useState(false);

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
        <Grid item xs={6}>
          <Stack spacing={3}>
            <Typography variant="h5">{props.bookData.title}</Typography>
            <Typography variant="p1">{props.bookData.author}</Typography>
            <Stack spacing={2} direction="row">
              <Button variant="contained" size="small">Favorite</Button> 
              <Button variant="outlined" size="small"  onClick={() => setShowRecomendModal(true)}> Recommend</Button>
            </Stack>
            <Typography>I walked through the door with you, the air was cold But somethin' 'bout it felt like home somehow</Typography>
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
        <Box sx={style}>
          Recommend to .. Name dropdown goes here
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Message
          </Typography>
           <TextField
            id="modal-modal-description"
            label="Thoughts.."
            multiline
            rows="4"
            fullWidth={true} 
            margin="normal"
          />
          <Button size="small" variant="contained">
            Send
          </Button>
          <Button size="small" onClick={() => setShowRecomendModal(false)}>
            Cancel
          </Button>
        </Box>
      </Modal>

    </>
  );
}