import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';
import { hashUserIdToColor } from '../Utils';


export default function PeopleList(props) {
	return (
    props.peopleData === "" ?
      <></> :
      Array.isArray(props.peopleData) && props.peopleData.length === 0?
        <Typography variant="body2">
          No users
        </Typography> :
        props.peopleData.map((person, index) => {
          return (
            <ListItem
              reloadDocument
              component={RouterLink}
              to={"/user-profile/" + person.uid}
              className="list-item"
              alignItems="flex-start"
              key={index}
            >
              <ListItemAvatar>
                <Avatar
                  alt={person.username + " avatar"}
                  sx={{ bgcolor: hashUserIdToColor(person.uid), width: 40, height: 40 }}
                >
                {person.username.charAt(0).toUpperCase()}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={person.username}
                secondary={
                  <Typography noWrap variant="body2" color="text.primary">
                    {person.bio}
                  </Typography>
                }
              />
            </ListItem>
          )
        })
  );
}