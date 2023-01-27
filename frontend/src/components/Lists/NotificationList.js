import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useNavigate } from "react-router-dom";
import { goToBookClub } from '../Utils'

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
              alt={notif.recommender + " avatar"}
              sx={{ width: 35, height: 35 }}
            >
            {notif.recommender.charAt(0)}
            </Avatar>
          </ListItemAvatar>
          <ListItemText>
            <Typography><strong>{notif.recommender}</strong> recommended <strong>{notif.book.title}</strong> to you </Typography>
            <Typography variant="caption">{notif.time}</Typography>
          </ListItemText>
        </MenuItem>
      )
    }
    )
  );
}