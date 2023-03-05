import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link as RouterLink } from 'react-router-dom';
import { tagsList } from '../../Constants';
import { auth } from '../../../../FirebaseConfig';
import { handleGetFetch, handlePostFetch, hashUserIdToColor } from '../../Utils';

export default function Post(props) {
  let loggedinUser = JSON.parse(sessionStorage.loggedinUser);

  const [isPostLikedData, setIsPostLikedData] = React.useState(false);
  const [numberOfLikes, setNumberOfLikes] = React.useState(props.post.likes);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  React.useEffect(() => {
    handleGetFetch("get_is_user_liked_posts?user_id=" + loggedinUser.uid + "&post_id=" + props.post.post_id).then((json) => {
      setIsPostLikedData(json.isUserLikedPost === "1");
    });
  },[loggedinUser.uid, props.post.post_id]);

  const handleLikeUnlikePost = (postId) => {
    auth.currentUser?.getIdToken(true).then(function(idToken){
      if (isPostLikedData) {
        handlePostFetch("unlike_post?token=" + idToken + "&post_id=" + postId, "").then(() => {
          props.setIsFetchPosts(!props.isFetchPosts);
          setNumberOfLikes(numberOfLikes - 1);
        });
        
      } else {
        handlePostFetch("like_post?token=" + idToken + "&post_id=" + postId, "").then(() => {
          props.setIsFetchPosts(!props.isFetchPosts);
          setNumberOfLikes(numberOfLikes + 1);
        });
      }
      setIsPostLikedData(!isPostLikedData);
    })
  }

  const handleDeletePost = () => {
    setShowDeleteModal(false);
    auth.currentUser?.getIdToken(true).then(function(idToken) {
      let route = "delete_post?token=" + idToken + "&postId=" + props.post.post_id;
      handlePostFetch(route, "").then(() => {
        props.setIsFetchPosts(!props.isFetchPosts);
      })
    })
  }

  let tagIcon = null;
  let tagColor = null;
  if (props.post.tag === "Spoiler" || props.post.tag === "Discussion" || props.post.tag === "Theory") {
    tagIcon = tagsList.filter(tag => tag.label === props.post.tag)[0]["icon"];
    tagColor = tagsList.filter(tag => tag.label === props.post.tag)[0]["color"];
  }

  let userProfileUrl = "/user-profile/" + props.post.user.userId;
  let bookProfileUrl ="/book-club/" + props.post.book.book_key;

  return (
    <>
    <Card elevation={0} className="post">
      <CardHeader
        avatar={
          <Avatar
            component={RouterLink}
            to={userProfileUrl}
            sx={{ bgcolor: hashUserIdToColor(props.post.user.userId), width: 50, height: 50, textDecoration: "none" }}
            aria-label={props.post.user.username + " avatar"}
          >
            {props.post.user.username.charAt(0).toUpperCase()}
          </Avatar>
        }
        action={
          props.post.user.userId === loggedinUser.uid ? 
            <IconButton aria-label="delete-post" onClick={()=> setShowDeleteModal(true)}>
              <DeleteIcon fontSize="small"/>
            </IconButton> :
            <></>
          }
        title={
          <Typography gutterBottom variant="p4">
            <Typography component={RouterLink} to={userProfileUrl}>{props.post.user.username}</Typography> in the <Typography component={RouterLink} to={bookProfileUrl}>{props.post.book.title}</Typography> Book Club
          </Typography>
        }
        subheader={
          new Date(props.post.date).toLocaleDateString('en-US', { year: "numeric", month: "short", day: "numeric"})
        }
      />
      <CardContent>
        <Typography gutterBottom variant="h6" color="text.secondary">
          {props.post.title}
          {tagIcon != null && tagColor != null &&
            <Chip
              icon={tagIcon}
              label={props.post.tag}
              color={tagColor}
              size="small"
              sx={{marginLeft:'1rem'}}
            />
          }
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {props.post.post}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton 
          onClick={() => handleLikeUnlikePost(props.post.post_id)}
          sx={{color: isPostLikedData ? "#ff4d67" : "#d9d9d9"}}
          aria-label="like"
        >
          <FavoriteIcon />
        </IconButton>
        <Typography variant='caption'>
          {numberOfLikes + (numberOfLikes === 1 ? " like" : " likes")}
        </Typography>
      </CardActions>
    </Card>
    <Modal
      open={showDeleteModal}
      onClose={() => setShowDeleteModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="basic-modal delete-post-modal">
        <Stack spacing={2}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Delete post
          </Typography>
          <Typography id="modal-modal-body" variant="body1" component="h2">
            Are you sure you want to delete your post?
          </Typography>
          <Stack justifyContent="end" direction="row" spacing={1}>
            <Button
              disableElevation
              size="small"
              variant="contained"
              onClick={handleDeletePost}>
              Delete
            </Button>
            <Button 
              disableElevation size="small"
              variant='outlined'
              onClick={()=> setShowDeleteModal(false)}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
    </>
  )
}