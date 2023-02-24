import React from "react";
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import PeopleList from '../components/Lists/PeopleList';
import BookClubBanner from '../components/Banners/BookClubBanner';
import CreatePost from "../components/CreatePost";
import PostList from '../components/Lists/PostList';

export default function BookClub() {
  let bookData = JSON.parse(sessionStorage.book) // should come from our API later
  const [bookClubPostsData, setBookClubPostsData] = React.useState('');

  React.useEffect(() => {
    const handleFetchBookClubPosts = async () => {
      let query = "http://localhost:4567/api/list_feed";
      try {
        const response = await fetch(query);
        const json = await response.json();
        const posts = json.posts;
        posts.sort(function (a, b) {
          return b.date - a.date;
        });
        setBookClubPostsData(posts);
      } catch (error) {
        console.log("error", error);
      }
    }
    handleFetchBookClubPosts();
  }, []);


  let membersData = [
    {
      "uid": "EHDvyZymtRSbciB7uXHv1mN5O9r2",
      "username": "Amanda"
    },
    {
      "uid": "sjzbuujj2hNljqVFpfJAplzXxjH3",
      "username": "VictorD"
    },
    {
      "uid": "DzS5RTEdqCTCafUtiw3YGMWKJUw1",
      "username": "zaynab"
    }
  ]


  return (
    <Box sx={{ width: '70%', margin: '0 auto' }}>
    <Grid container rowSpacing={5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      <Grid item xs={12}>
        <BookClubBanner bookData={bookData}/>
      </Grid>
      <Grid item xs={8}>
        <div style={{marginBottom: '0.5rem'}}>
          <CreatePost/>
        </div>
          <PostList postsData={bookClubPostsData} />
      </Grid>
      <Grid item xs={4}>
        <Button disableElevation sx={{ width: '100%', marginBottom: '1rem' }} variant="contained">
          Join the club
        </Button>
        <Typography variant="overline">
          Members
        </Typography>
        <PeopleList peopleData={membersData}/>
      </Grid>
    </Grid>
  </Box>
  );
};