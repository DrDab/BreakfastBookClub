import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link as RouterLink } from "react-router-dom";
import { auth } from "../../FirebaseConfig";
import { handlePostFetch, hashUserIdToColor } from './Utils'

export default function Notification(props) {
  let userProfileUrl = "/user-profile/" + props.notif.recommender.uid;
  let bookProfileUrl ="/book-club/" + props.notif.book.book_key;
  const [deleteDisplay, setDeleteDisplay] = React.useState(false);

  const handleDeleteNotif = () => {
    auth.currentUser?.getIdToken(true).then(function(idToken) {
      let route = "delete_recommendation?token=" + idToken +
                  "&sender_userId=" + props.notif.recommender.uid +
                  "&book_key=" + props.notif.book.book_key;

      handlePostFetch(route, "").then(() => {
        setDeleteDisplay(true);
      })
    })
  }

  return (
    <MenuItem
      className="list-item"
      sx={{whiteSpace: 'normal', backgroundColor: '#fafafa', display: deleteDisplay? 'none': ""}}
    >
      <ListItemAvatar>
        <Avatar
          reloadDocument
          component={RouterLink}
          to={userProfileUrl}
          sx={{ bgcolor: hashUserIdToColor(props.notif.recommender.uid),
                width: 32,
                height: 32,
                textDecoration: "none"
              }}
          aria-label={props.notif.recommender.username + " avatar"}
        >
        {props.notif.recommender.username.charAt(0).toUpperCase()}
        </Avatar>
      </ListItemAvatar>
      <ListItemText>
        <Stack sx={{display: 'flex', alignItems: 'center'}} direction="row" justifyContent="space-between" m={0.5}>
          <Typography noWrap >
            <a href={userProfileUrl}>{props.notif.recommender.username}</a> recommended <a href={bookProfileUrl}>{props.notif.book.title}</a>
          </Typography>
          <IconButton aria-label="delete-notif" onClick={handleDeleteNotif}>
            <DeleteIcon fontSize="small"/>
          </IconButton>
        </Stack>
      </ListItemText>
    </MenuItem>
  )
}