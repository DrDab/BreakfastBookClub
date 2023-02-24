import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { goToBookClub } from '../Utils'
import { avatarColorMap } from '../Constants'

export default function NotificationList(props) {
  const navigate = useNavigate();

	return (
    props.notificationData.map((notif, index) => {
      return (
        <MenuItem
          sx={{whiteSpace: 'normal', backgroundColor: '#fafafa'}}
          key={index}
          onClick={() => goToBookClub(notif.book, navigate)}
        >
          <ListItemAvatar>
            <Avatar
              reloadDocument
              component={RouterLink}
              to={"/user-profile/" + notif.recommender.uid}
              sx={{ bgcolor: avatarColorMap.get(notif.recommender.username), width: 35, height: 35, textDecoration: "none" }}
              aria-label={notif.recommender.username + " avatar"}
            >
             {notif.recommender.username.charAt(0)}
            </Avatar>
          </ListItemAvatar>
          <ListItemText>
            <Typography>
              <strong>{notif.recommender.username}</strong> recommended <strong>{notif.book.title}</strong> to you
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