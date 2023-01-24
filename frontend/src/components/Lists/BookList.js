import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useNavigate } from "react-router-dom";


export default function BookList(props) {
  const navigate = useNavigate();
  
  const goToBookClub = async (book) => {
    sessionStorage.setItem('book', JSON.stringify(book));
    navigate("/book-club" + book.key)
    window.location.reload();
  };

	return (
    props.bookData.map((book, index) => {
      return (
        <ListItem 
          className="search-result" 
          alignItems="flex-start"
          key={index}
          onClick={() => goToBookClub(book)}
          >
          <ListItemAvatar>
            <Avatar
              className="search-results-book-cover"
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