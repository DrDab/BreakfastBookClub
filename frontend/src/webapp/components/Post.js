import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link as RouterLink } from "react-router-dom";
import { tagsList } from './Constants';
import { auth } from "../../FirebaseConfig";
import { handleGetFetch, handlePostFetch, hashUserIdToColor } from './Utils'

export default function Post(props) {
  let loggedinUser = JSON.parse(sessionStorage.loggedinUser);

  const [isPostLikedData, setIsPostLikedData] = React.useState(false);
  const [numberOfLikes, setNumberOfLikes] = React.useState(props.post.likes);
  const [deleteDisplay, setDeleteDisplay] = React.useState(false);

  React.useEffect(() => {
    handleGetFetch("get_is_user_liked_posts?user_id=" + loggedinUser.uid + "&post_id=" + props.post.post_id).then((json) => {
      setIsPostLikedData(json.isUserLikedPost === "1");
    });
  },[loggedinUser.uid, props.post.post_id]);

  const handleLikeUnlikePost = (postId) => {
    auth.currentUser?.getIdToken(true).then(function(idToken){
      if (isPostLikedData){
        handlePostFetch("unlike_post?token=" + idToken + "&post_id=" + postId, "");
        setNumberOfLikes(numberOfLikes - 1);
      } else {
        handlePostFetch("like_post?token=" + idToken + "&post_id=" + postId, "");
        setNumberOfLikes(numberOfLikes + 1);
      }
      setIsPostLikedData(!isPostLikedData);
    })
  }

  const handleDeletePost = () => {
    auth.currentUser?.getIdToken(true).then(function(idToken) {
      let route = "delete_post?token=" + idToken + "&postId=" + props.post.post_id;
      handlePostFetch(route, "").then(() => {
        setDeleteDisplay(true);
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
    <Card elevation={0} className="post" sx={{display: deleteDisplay? 'none': ""}}>
      <CardHeader
        avatar={
          <Avatar
            reloadDocument
            component={RouterLink}
            to={userProfileUrl}
            sx={{ bgcolor: hashUserIdToColor(props.post.user.userId), width: 50, height: 50, textDecoration: "none" }}
            aria-label={props.post.user.username + " avatar"}
          >
            {props.post.user.username.charAt(0)}
          </Avatar>
        }
        action={
          props.post.user.userId === loggedinUser.uid ? 
            <IconButton aria-label="delete-post" onClick={handleDeletePost}>
              <DeleteIcon fontSize="small"/>
            </IconButton> :
            <></>
          }
        title={
          <Typography gutterBottom variant="p4">
            <a href={userProfileUrl}>{props.post.user.username}</a> in the <a href={bookProfileUrl}>{props.post.book.title}</a> Book Club
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
  )
}