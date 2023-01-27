import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useNavigate } from "react-router-dom";
import {goToUserProfile} from '../Utils'

export default function PeopleList(props) {
  const navigate = useNavigate();

	return (
      props.peopleData.map((person, index) => {
      return (
        <ListItem
          className="list-item"
          alignItems="flex-start"
          key={index}
          onClick={() => goToUserProfile(person, navigate)}
          >
          <ListItemAvatar>
            <Avatar
              alt={person + " avatar"}
              sx={{ width: 40, height: 40 }}
            >
            {person.charAt(0)}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={person}
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