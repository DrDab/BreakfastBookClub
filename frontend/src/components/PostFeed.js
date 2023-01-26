import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from "react-router-dom";
import { goToUserProfile } from './Utils';
import { tagsList } from './Constants';

export default function PostFeed(props) {
  const navigate = useNavigate();

	return (
    props.postsData.map((post, index) => {
      let tagIcon = tagsList.filter(tag => tag.label === post.tag)[0]["icon"]
      let tagColor  = tagsList.filter(tag => tag.label === post.tag)[0]["color"]
      return (
        <Card key={index} elevation={0} className="main-feed-post">
          <CardHeader
            avatar={
              <Avatar 
                sx={{ bgcolor: red[500],width: 50, height: 50 }} 
                aria-label={post.user + " avatar"}
                onClick={() => goToUserProfile(post.user, navigate)}
              >
                {post.user.charAt(0)}
              </Avatar>
            }
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            title={post.user + " in the " + post.club + " Book Club"}
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
            <IconButton aria-label="like">
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="share">
              <ShareIcon />
            </IconButton>
          </CardActions>
        </Card>
      )
    }
    )
  );
}