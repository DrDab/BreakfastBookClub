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
import PostFeedSkeleton from './Skeletons/PostFeedSkeleton';

export default function PostFeed(props) {

	return (
    props.postsData === "" ? 
      <PostFeedSkeleton/> :
      Array.isArray(props.postsData) && props.postsData.length === 0? 
        <Typography> No posts yet </Typography>:
        props.postsData.map((post, index) => {
          let tagIcon = null;
          let tagColor = null;
          if (post.tag === "Spoiler" || post.tag === "Discussion" || post.tag === "Theory") {
            tagIcon = tagsList.filter(tag => tag.label === post.tag)[0]["icon"];
            tagColor = tagsList.filter(tag => tag.label === post.tag)[0]["color"];
          }

          return (
            <Card key={index} elevation={0} className="post">
              <CardHeader
                avatar={
                  <Avatar
                    reloadDocument
                    component={RouterLink}
                    to={"/user-profile/" + post.user.userId}
                    sx={{ bgcolor: avatarColorMap.get(post.user.username), width: 50, height: 50, textDecoration: "none" }}
                    aria-label={post.user.username + " avatar"}
                  >
                    {post.user.username.charAt(0)}
                  </Avatar>
                }
                title={
                  <Typography gutterBottom variant="p4">
                    <strong>{post.user.username}</strong> in the <strong>{post.book.title}</strong> Book Club
                  </Typography>
                }
                subheader={
                  new Date(post.date).toLocaleDateString('en-US', { year: "numeric", month: "short", day: "numeric"})
                }
              />
              <CardContent>
                <Typography gutterBottom variant="h6" color="text.secondary">
                  {post.title}

                  {tagIcon != null && tagColor != null &&
                  <Chip
                    icon={tagIcon}
                    label={post.tag}
                    color={tagColor}
                    size="small"
                    sx={{marginLeft:'1rem'}}
                  />
                  }
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {post.post}
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
                <IconButton onClick={()=> console.log("like post")} sx={{color: 'grey'}} aria-label="like">
                  <FavoriteIcon />
                </IconButton>
                <Typography variant='caption'>
                  {post.likes} likes
                </Typography>
              </CardActions>
            </Card>
          )
        })
  );
}