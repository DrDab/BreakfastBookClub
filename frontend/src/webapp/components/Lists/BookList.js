import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useNavigate } from "react-router-dom";
import { goToBookClub } from "../Utils"
import BookListSkeleton from '../Skeletons/BookListSkeleton';

export default function BookList(props) {
  const navigate = useNavigate();

	return (
    props.bookData.length === 0 ? 
     <BookListSkeleton/> :
      props.bookData.map((book, index) => {
        return (
          <ListItem
            className="list-item"
            alignItems="flex-start"
            key={index}
            onClick={() => goToBookClub(book, navigate)}
            >
            <ListItemAvatar>
              <Avatar
                className="list-item-book-cover"
                variant="rounded"
                alt={book.title + " cover"}
                src={book.coverUrl}
                sx={{ width: 70, height: 100 }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={book.title}
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {book.author}
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