import React from 'react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import { red } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';


export default function CreatePost() {
  const [showPostModal, setShowPostModal] = React.useState(false);

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
      <Card elevation={0} className="main-feed-post">
        <CardContent>
          <Stack direction="row" spacing={2}>
            <Avatar sx={{ bgcolor: red[500],width: 50, height: 50 }} aria-label={" avatar"}>
              A
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
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Write a post
          </Typography>
          <TextField
            id="modal-modal-description"
            label="Title"
            fullWidth={true} 
            margin="normal"
          />
           <TextField
            id="modal-modal-description"
            label="Thoughts.."
            fullWidth={true} 
            margin="normal"
          />
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Tags: Opinion, Theory, Spoiler, Analysis, Prediction
          </Typography>
        </Box>
      </Modal>
    </>
    
  );
}