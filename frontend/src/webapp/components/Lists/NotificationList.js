import React from 'react';
import Typography from '@mui/material/Typography';
import Notification from './ListItems/Notification';

export default function NotificationList(props) {
	return (
    props.notificationData === "" ?
      <></> :
      Array.isArray(props.notificationData) && props.notificationData.length === 0 ? 
        <Typography m={1} ml={2} variant="body2">
          No notifications
        </Typography> :
          props.notificationData.map((notif, index) => {
            return (<Notification key={index} notif={notif} />)
          })
  );
}