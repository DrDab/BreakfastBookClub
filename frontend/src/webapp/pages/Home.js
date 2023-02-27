import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import PeopleList from '../components/Lists/PeopleList';
import BookList from '../components/Lists/BookList';
import CreatePost from '../components/CreatePost';
import PostList from '../components/Lists/PostList';
import { formatOpenLibraryData } from '../components/Utils';

export default function Home() {
  let loggedinUser = JSON.parse(sessionStorage.loggedinUser);

  const [popularBooksData, setPopularBooksData] = React.useState("");
  const [homePostsData, setHomePostsData] = React.useState("");
  const [loggedinUserLikedPostsData, setLoggedinUserLikedPostsData] = React.useState('');
  const [isFetchPosts, setIsFetchPosts] = React.useState(false);

  React.useEffect(() => {
    const handleFetchPopularBooks = async () => {
      let searchQuery = "http://openlibrary.org/search.json?q=lord+of+the+rings&limit=3"
      try {
        const response = await fetch(searchQuery);
        const json = await response.json();
        let formattedData = formatOpenLibraryData(json);
        setPopularBooksData(formattedData);
      } catch (error) {
        console.log("error", error);
      }
    }

    const handleFetchLoggedinUserLikedPosts = async () => {
      let query = " http://localhost:4567/api/get_liked_posts?user_id=" + loggedinUser.uid;
      try {
        const response = await fetch(query);
        const json = await response.json();
        const posts = json.posts;
        setLoggedinUserLikedPostsData(posts);
      } catch (error) {
        console.log("error", error);
      }
    }

    handleFetchPopularBooks();
    handleFetchLoggedinUserLikedPosts();
  },[loggedinUser.uid]);

  React.useEffect(() => {
    const handleFetchPosts = async () => {
      let query = "http://localhost:4567/api/list_feed";
      try {
        const response = await fetch(query);
        const json = await response.json();
        const posts = json.posts;
        posts.sort(function (a, b) {
          return b.date - a.date;
        });
        setHomePostsData(posts);
      } catch (error) {
        console.log("error", error);
      }
    }
    handleFetchPosts();
  },[isFetchPosts]);

  let popularPeopleData = [
    {
      "uid": "EHDvyZymtRSbciB7uXHv1mN5O9r2",
      "username": "Amanda",
      "bio": "bio"
    },
    {
      "uid": "sjzbuujj2hNljqVFpfJAplzXxjH3",
      "username": "VictorD",
      "bio": "bio"
    },
    {
      "uid": "DzS5RTEdqCTCafUtiw3YGMWKJUw1",
      "username": "zaynab",
      "bio": "bio"
    }
  ]

  return (
    <Box sx={{ width: '70%', margin: '0 auto' }}>
    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      <Grid item xs={8}>
        <CreatePost setIsFetchPosts={setIsFetchPosts} isFetchPosts={isFetchPosts} />
      </Grid>
      <Grid item xs={8}>
        <PostList postsData={homePostsData} loggedinUserLikedPostsData={loggedinUserLikedPostsData} />
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