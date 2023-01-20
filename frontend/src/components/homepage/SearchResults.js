import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

export default function SearchResults(props) {

  let cleanResults = [];

  if (props.searchResults !== "") {
    for (let i = 0; i < props.searchResults.docs.length; i++ ) {
      let book = props.searchResults.docs[i];
      let title = book.title;
      let author = book.author_name;
      let coverUrl = "https://covers.openlibrary.org/b/isbn/" + book.isbn?.[0] + "-M.jpg";
      cleanResults.push({title, author, coverUrl})
    }
  }

	return (
    cleanResults.map((book, index) => {
      return (
        <ListItem className="search-results-book" alignItems="flex-start" key={index}>
          <ListItemAvatar>
            <Avatar
              variant="rounded"
              alt={book.title + " cover"}
              src={book.coverUrl}
              sx={{ width: 70, height: 100 }}
              className="search-results-book-cover"
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