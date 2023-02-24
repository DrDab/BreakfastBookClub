import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from "react-router-dom";
import { avatarColorMap } from '../Constants';

export default function PeopleList(props) {

	return (
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
              sx={{ bgcolor: avatarColorMap.get(person.username), width: 40, height: 40 }}
            >
            {person.username.charAt(0)}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={person.username}
            secondary={
              <React.Fragment>
                <Typography
                  sx={{ display: 'inline' }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  bio...
                </Typography>
              </React.Fragment>
            }
          />
        </ListItem>
      )
    }
  )
  );
}