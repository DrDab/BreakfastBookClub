import React, { useState, useEffect } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useNavigate } from "react-router-dom";


export default function ResultsList(props) {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState("");

  useEffect(() => {
    const handleFetch = async () => {
      let searchValue = sessionStorage.getItem('searchValue')
      let searchQuery = "http://openlibrary.org/search.json?q=" + searchValue.replace(/ /g, '+') + "&limit=20" // ex searchQuery: http://openlibrary.org/search.json?q=the+lord+of+the+rings
      try {
        const response = await fetch(searchQuery);
        const json = await response.json();
        setSearchResults(json)
      } catch (error) {
        console.log("error", error);
      }
    }
    handleFetch();
}, []);

  let cleanResults = [];
  if (searchResults !== "") {
    for (let i = 0; i < searchResults.docs.length; i++ ) {
      let book = searchResults.docs[i];
      let title = book.title;
      let author = book.author_name;
      let coverUrl = "https://covers.openlibrary.org/b/isbn/" + book.isbn?.[0] + "-M.jpg";
      cleanResults.push({title, author, coverUrl})
    }
  }


  const goToBookClub = async (bookTitle) => {
    sessionStorage.setItem('bookClub', bookTitle);
    navigate("/book-club")
  };

	return (
    cleanResults.map((book, index) => {
      return (
        <ListItem 
          className="search-result" 
          alignItems="flex-start"
          key={index}
          onClick={() => goToBookClub(book.title)}
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