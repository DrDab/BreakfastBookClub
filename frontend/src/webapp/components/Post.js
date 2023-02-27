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
import { Link as RouterLink } from "react-router-dom";
import { tagsList, avatarColorMap } from './Constants';
import { auth } from "../../FirebaseConfig"

export default function Post(props) {
  
  const [isPostLiked, setIsPostLiked] = React.useState(props.isPostLiked);
  const [numberOfLikes, setNumberOfLikes] = React.useState(props.post.likes);

  const handleFetchPostLikeStatus = (token, postId, status) => {
    let url = "http://localhost:4567/api/"+ status + "?token=" + token + "&post_id=" + postId;
    fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(() => {
      setNumberOfLikes(status === "like_post" ? numberOfLikes + 1 : numberOfLikes - 1);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const handleLikeUnlikePost = (postId) => {
    auth.currentUser?.getIdToken(true).then(function(idToken){
      if (isPostLiked){
        handleFetchPostLikeStatus(idToken, postId, "unlike_post");
      } else {
        handleFetchPostLikeStatus(idToken, postId, "like_post"); 
      }
      setIsPostLiked(!isPostLiked);
    })
  }

  let tagIcon = null;
  let tagColor = null;
  if (props.post.tag === "Spoiler" || props.post.tag === "Discussion" || props.post.tag === "Theory") {
    tagIcon = tagsList.filter(tag => tag.label === props.post.tag)[0]["icon"];
    tagColor = tagsList.filter(tag => tag.label === props.post.tag)[0]["color"];
  }

  let userProfileUrl = "/user-profile/" + props.post.user.userId;
  let bookProfileUrl ="/book-club/" + props.post.book.book_id;

  return (
    <Card elevation={0} className="post">
      <CardHeader
        avatar={
          <Avatar
            reloadDocument
            component={RouterLink}
            to={userProfileUrl}
            sx={{ bgcolor: avatarColorMap.get(props.post.user.username), width: 50, height: 50, textDecoration: "none" }}
            aria-label={props.post.user.username + " avatar"}
          >
            {props.post.user.username.charAt(0)}
          </Avatar>
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
          sx={{color: isPostLiked ? "red" : "grey"}}
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