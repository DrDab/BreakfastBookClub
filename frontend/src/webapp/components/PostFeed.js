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

export default function PostFeed(props) {

	return (
    props.postsData.map((post, index) => {
      let tagIcon = tagsList.filter(tag => tag.label === post.tag)[0]["icon"]
      let tagColor = tagsList.filter(tag => tag.label === post.tag)[0]["color"]
      return (
        <Card key={index} elevation={0} className="post">
          <CardHeader
            avatar={
              <Avatar 
                component={RouterLink}
                to={"/user-profile/" + post.user}
                sx={{ bgcolor: avatarColorMap.get(post.user), width: 50, height: 50, textDecoration: "none" }}
                aria-label={post.user + " avatar"}
              >
                {post.user.charAt(0)}
              </Avatar>
            }
            title={
              <Typography gutterBottom variant="p4">
                <strong>{post.user}</strong> in the <strong>{post.club}</strong> Book Club
              </Typography>
            }
            subheader="September 14, 2016"
          />
          <CardContent>
            <Typography gutterBottom variant="h6" color="text.secondary">
              {post.title}
              <Chip
                icon={tagIcon}
                label={post.tag}
                color={tagColor}
                size="small"
                sx={{marginLeft:'1rem'}}
              />
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {post.content}
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton onClick={()=> console.log("like post")} sx={{color: post.isLikedByUser? 'red': 'grey'}} aria-label="like">
              <FavoriteIcon />
            </IconButton>
            <Typography variant='caption'>
              {post.likes} likes
            </Typography> 
          </CardActions>
        </Card>
      )
    }
    )
  );
}