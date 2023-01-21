import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function MainFeed(props) {

  let postData = [];
  for (let i = 0; i < 20; i++ ) {
      let user = "Amanda Ha";
      let club = "Harry Potter";
      let title = "New book realease " + i;
      let content = "Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving chicken and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and pepper, and cook, stirring often until thickened and fragrant, about 10 minutes. Add saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.";
      postData.push({user, club, title, content})
  }




	return (
    postData.map((post, index) => {
      return (
        <Card key={index} elevation={0} className="main-feed-post">
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: red[500],width: 50, height: 50 }} aria-label={post.user + " avatar"}>
                A
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
            <Typography mb={1} variant="h6" color="text.secondary">
              {post.title}
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