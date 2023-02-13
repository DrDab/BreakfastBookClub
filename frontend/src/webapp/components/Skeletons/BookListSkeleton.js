import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';

export default function BookListSkeleton(props) {
  const posts = [...Array(5).keys()]
  return (
    posts.map((post, index) => {
      return (
        <ListItem
          className="list-item"
          alignItems="flex-start"
          key={index}
          >
          <ListItemAvatar>
            <Skeleton animation="wave" variant="rounded" width={70} height={100} />
          </ListItemAvatar>
          <ListItemText
            primary={ 
              <Skeleton animation="wave" height={14} width="60%" sx={{ marginLeft: 1, marginBottom: 1 }} />
            }
            secondary={
              <Skeleton animation="wave" height={10} width="40%" sx={{ marginLeft: 1}} />
            }
          />
        </ListItem>
      )
    }
    )
  );
}