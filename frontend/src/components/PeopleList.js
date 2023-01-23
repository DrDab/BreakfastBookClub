import React, { useState, useEffect } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Link, useNavigate } from "react-router-dom";

export default function PeopleList(props) {
  const navigate = useNavigate();
  
  const goToOtherUserProfile = async (person) => {
    sessionStorage.setItem('otherUser', JSON.stringify(person));
    navigate("/user-profile")
  };

	return (
      props.peopleData.map((person, index) => {
      return (
        <ListItem 
          className="search-result" 
          alignItems="flex-start"
          key={index}
          onClick={() => goToOtherUserProfile(person)}
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