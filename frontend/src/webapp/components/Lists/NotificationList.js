import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from "react-router-dom";
import { avatarColorMap } from '../Constants'

export default function NotificationList(props) {

	return (
    props.notificationData.map((notif, index) => {

      let userProfileUrl = "/user-profile/" + notif.recommender.uid;
      let bookProfileUrl ="/book-club/" + notif.book.book_id;
      
      return (
        <MenuItem
          className="list-item"
          sx={{whiteSpace: 'normal', backgroundColor: '#fafafa'}}
          key={index}
        >
          <ListItemAvatar>
            <Avatar
              reloadDocument
              component={RouterLink}
              to={userProfileUrl}
              sx={{ bgcolor: avatarColorMap.get(notif.recommender.username), width: 35, height: 35, textDecoration: "none" }}
              aria-label={notif.recommender.username + " avatar"}
            >
             {notif.recommender.username.charAt(0)}
            </Avatar>
          </ListItemAvatar>
          <ListItemText>
            <Typography>
              <a href={userProfileUrl}>{notif.recommender.username}</a> recommended <a href={bookProfileUrl}>{notif.book.title}</a> to you
            </Typography>
            <Typography variant="caption">
              {notif.time}
            </Typography>
          </ListItemText>
        </MenuItem>
      )
    }
    )
  );
}