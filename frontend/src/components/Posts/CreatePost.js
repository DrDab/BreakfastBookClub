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
import Button from '@mui/material/Button';
import { useNavigate} from "react-router-dom";
import { goToUserProfile } from '../Utils'
import Chip from '@mui/material/Chip';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import RecommendIcon from '@mui/icons-material/Recommend';
import ContactlessRoundedIcon from '@mui/icons-material/ContactlessRounded';

export default function CreatePost() {
  const [showPostModal, setShowPostModal] = React.useState(false);
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
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Write a post
          </Typography>
          <TextField
            id="modal-modal-description"
            label="Title"
            fullWidth={true} 
            margin="normal"
            size="small"
          />
           <TextField
            id="modal-modal-description"
            label="Thoughts.."
            multiline
            rows="4"
            fullWidth={true} 
            margin="normal"
          />
          <Button size="small" variant='contained'>
            Post
          </Button>
          <Button size="small" onClick={() => setShowPostModal(false)}>
            Cancel
          </Button>

          <Stack sx={{margin:'1rem 0rem 1rem 0rem'}} direction="row" spacing={1}>
            <Chip
              icon={<NewReleasesIcon/>}
              label="Spoiler"
              color="warning"
              size="small"
              />
              
              <Chip
              icon={<RecommendIcon/>}
              label={"Recommendation"}
              color={"success"}
              size="small"
              />
              
              <Chip
              icon={<ContactlessRoundedIcon/>}
              label={"Opinion"}
              color="secondary"
              size="small"
              />
          </Stack>
        </Box>
      </Modal>
    </>
  );
}