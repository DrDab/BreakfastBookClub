import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import PeopleList from '../components/Lists/PeopleList';
import BookList from '../components/Lists/BookList';
import CreatePost from '../components/CreatePost';
import PostFeed from '../components/PostFeed';

export default function Home() {
  const [popularBooks, setPopularBooks] = React.useState("");
  const [homePostsData, setHomePostsData] = React.useState("");

  React.useEffect(() => {
    const handleFetchPopularBooks = async () => {
      let searchQuery = "http://openlibrary.org/search.json?q=lord+of+the+rings&limit=3"
      try {
        const response = await fetch(searchQuery);
        const json = await response.json();
        setPopularBooks(json)
      } catch (error) {
        console.log("error", error);
      }
    }
    handleFetchPopularBooks();

    const handleFetchPosts = async () => {
      let query = "http://localhost:4567/api/list_feed";
      try {
        const response = await fetch(query);
        const json = await response.json();
        setHomePostsData(json)
      } catch (error) {
        console.log("error", error);
      }
    }
    handleFetchPosts();

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
  
  let popularPeopleData = [];
  for (let i = 0; i < 1; i++ ) {
    popularPeopleData.push("Andrea");
    popularPeopleData.push("Jocelyn");
    popularPeopleData.push("Sanjana");
    popularPeopleData.push("Zaynab");
  }

  return (
    <Box sx={{ width: '70%', margin: '0 auto' }}>
    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      <Grid item xs={8}>
        <CreatePost/>
      </Grid>
      <Grid item xs={8}>
        <PostFeed postsData={homePostsData.posts || []} />
      </Grid>
      <Grid item xs={4}>
        <Stack spacing={2}>
          <div>
            <Typography variant="overline">
              Trending Books
            </Typography>
            <BookList bookData={popularBooksData} />
          </div>
          <div>
            <Typography variant="overline">
              Trending Readers
            </Typography>
            <PeopleList peopleData={popularPeopleData}/>
          </div>
        </Stack>
      </Grid>
    </Grid>
  </Box>
  );
}