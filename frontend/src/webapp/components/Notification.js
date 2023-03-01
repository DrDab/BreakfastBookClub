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
import { avatarColorMap } from './Constants'
import { auth } from "../../FirebaseConfig";

export default function Notification(props) {
  let userProfileUrl = "/user-profile/" + props.notif.recommender.uid;
  let bookProfileUrl ="/book-club/" + props.notif.book.book_id;

  const handleFetchPostDeleteRecommendation = (token, recommenderUid, bookKey) => {
    let url = "http://localhost:4567/api/delete_recommendation?token=" + token + "&sender_userId=" + recommenderUid + "&book_key=" + bookKey;
    fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((data) => {
      console.log('Success:', data);
      props.setIsFetchRecommendations(!props.isFetchRecommendations);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const handleDeleteNotif = () => {
    console.log("delete Notif")
    auth.currentUser?.getIdToken(true).then(function(idToken){
      handleFetchPostDeleteRecommendation(idToken, props.notif.recommender.uid, props.notif.book.book_id);
    })
  }

  return (
    <MenuItem
      className="list-item"
      sx={{whiteSpace: 'normal', backgroundColor: '#fafafa'}}
    >
      <ListItemAvatar>
        <Avatar
          reloadDocument
          component={RouterLink}
          to={userProfileUrl}
          sx={{ bgcolor: avatarColorMap.get(props.notif.recommender.username),
                width: 32,
                height: 32,
                textDecoration: "none"
              }}
          aria-label={props.notif.recommender.username + " avatar"}
        >
        {props.notif.recommender.username.charAt(0)}
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