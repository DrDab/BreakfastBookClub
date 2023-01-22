import React, { useState, useEffect } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Link, useNavigate } from "react-router-dom";

export default function MembersList(props) {

  let members = [];
  for (let i = 0; i < 3; i++ ) {
    members.push("Andrea")
    members.push("Amanda")
    members.push("Jocelyn")
    members.push("Victor")
    members.push("Sanjana")
    members.push("Zaynab")
  }

	return (
    members.map((member, index) => {
      return (
        // <Link to="/user-profile">
        <ListItem 
          className="search-result" 
          alignItems="flex-start"
          key={index}
          >
          <ListItemAvatar>
            <Avatar
              alt={member + " avatar"}
              sx={{ width: 30, height: 30 }}
            >
            {member.charAt(0)}
            </Avatar>

          </ListItemAvatar>
          <ListItemText
            primary={member}
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
        // </Link>
      )
    }
  )

  );
}