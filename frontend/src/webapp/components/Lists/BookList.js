import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import BookListSkeleton from '../Skeletons/BookListSkeleton';
import { Link as RouterLink } from "react-router-dom";

export default function BookList(props) {
	return (
    props.bookData === "" ?
      <BookListSkeleton/> :
      Array.isArray(props.bookData) && props.bookData.length === 0?
        <Typography variant="body2">
          No books
        </Typography> :
        props.bookData.map((book, index) => {
          return (
            <ListItem
              reloadDocument
              component={RouterLink}
              to={"/book-club/" + (props.isFromOpenLibrary? book.key.split("/")[2] : book.book_key)} 
              className="list-item"
              alignItems="flex-start"
              key={index}
              >
              <ListItemAvatar>
                <Avatar
                  className="list-item-book-cover"
                  variant="rounded"
                  alt={book.title + " cover"}
                  src={props.isFromOpenLibrary? book.coverUrl : book.thumbnail}
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
        })
  );
}