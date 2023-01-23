import React from "react";
import UserProfileBanner from '../components/UserProfileBanner';
import BookList from '../components/BookList';
import PostFeed from '../components/PostFeed';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CreatePost from "../components/CreatePost";

export default function UserProfile() {
  let userData = JSON.parse(sessionStorage.otherUser)

  let userPostsData = [];
  for (let i = 0; i < 20; i++ ) {
      let user = userData;
      let club = "harry potter";
      let title = "Spoiler for chapter " + i;
      let content = "Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving chicken and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and pepper, and cook, stirring often until thickened and fragrant, about 10 minutes. Add saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.";
      userPostsData.push({user, club, title, content})
  }


  let bookClubsJoinedData = [];
  for (let i = 0; i < 10; i++ ) {
    // let book = searchResultsBooks.docs[i];
    let title = "Harry Potter Fake"
    let author = "Jk Rowling"
    let coverUrl = "";
    bookClubsJoinedData.push({title, author, coverUrl})
  }


  return (
    <Box sx={{ width: '70%', margin: '0 auto' }}>
    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      <Grid item xs={12}>
        <div className="book-club-info">
          <UserProfileBanner/>
        </div>
      </Grid>
      <Grid item xs={8}>
        <CreatePost/>
      </Grid>
      <Grid item xs={8}>
        <PostFeed postsData={userPostsData} />
      </Grid>
      <Grid item xs={4}>
        <Typography>
          Book Clubs
        </Typography>
         <BookList bookData={bookClubsJoinedData}/>
      </Grid>
    </Grid>
  </Box>
  );
};