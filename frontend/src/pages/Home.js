import React, { useState, useEffect } from 'react';
import PostFeed from '../components/Posts/PostFeed';
import PeopleList from '../components/Lists/PeopleList';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CreatePost from '../components/Posts/CreatePost';
import BookList from '../components/Lists/BookList';
import Stack from '@mui/material/Stack';


export default function Home() {
  sessionStorage.setItem('yourUser', JSON.stringify("Amanda"));
  const [popularBooks, setPopularBooks] = useState("");

  useEffect(() => {
    const handleFetch = async () => {
      let searchQuery = "http://openlibrary.org/search.json?q=lord+of+the+rings&limit=3" // ex searchQuery: http://openlibrary.org/search.json?q=the+lord+of+the+rings
      try {
        const response = await fetch(searchQuery);
        const json = await response.json();
        setPopularBooks(json)
      } catch (error) {
        console.log("error", error);
      }
    }
    handleFetch();
}, []);

  let popularBooksData = [];
  if (popularBooks !== "") {
    for (let i = 0; i < popularBooks.docs.length; i++ ) {
      let book = popularBooks.docs[i];
      let key = book.key;
      let title = book.title;
      let author = book.author_name;
      let coverUrl = book.cover_i ? "https://covers.openlibrary.org/b/id/" + book.cover_i  + "-M.jpg" : "";
      popularBooksData.push({key, title, author, coverUrl})
    }
  }
  
  let homePostsData = [];
  for (let i = 0; i < 20; i++ ) {
    let user = i % 3 == 0? "Andrea" : i % 3 == 1? "Jocelyn" : "Victor" ;
    let club = i % 3 == 0? "Wonder" : i % 3 == 1? "Twilight New Moon" : "Harry Potter and the Goblet of Fire" ;
    let title = i % 3 == 0? "Spoiler Review" : i % 3 == 1? "Book Recommendations 2023" : "Hot take on chapter 3" ;
    let content = "Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving chicken and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and pepper, and cook, stirring often until thickened and fragrant, about 10 minutes. Add saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.";
    let tag = i % 3 == 0? "Spoiler" : i % 3 == 1? "Theory" : "Discussion" ;
    homePostsData.push({user, club, title, content, tag})
  }

  let popularPeopleData = [];
  for (let i = 0; i < 1; i++ ) {
    popularPeopleData.push("Andrea")
    popularPeopleData.push("Amanda")
    popularPeopleData.push("Jocelyn")
    popularPeopleData.push("Victor")
    popularPeopleData.push("Sanjana")
    popularPeopleData.push("Zaynab")
  }

  return (
    <Box sx={{ width: '70%', margin: '0 auto' }}>
    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      <Grid item xs={8}>
        <CreatePost/>
      </Grid>
      <Grid item xs={8}>
        <PostFeed postsData={homePostsData} />
      </Grid>
      <Grid item xs={4}>
        <Stack spacing={2}>
          <div>
            <Typography>
              Trending Books
            </Typography>
            <BookList bookData={popularBooksData}/>
          </div>
          <div>
            <Typography>
              Trending People
            </Typography>
            <PeopleList peopleData={popularPeopleData}/>
          </div>
        </Stack>
      </Grid>
    </Grid>
  </Box>
  );


  
}