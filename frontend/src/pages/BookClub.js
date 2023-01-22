import React from "react";
import BookProfile from '../components/bookClubPageComponents/BookProfile';
import PeopleList from '../components/PeopleList';
import PostFeed from '../components/PostFeed';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

export default function BookClub() {
  let bookData = JSON.parse(sessionStorage.book)

  let membersData = [];
  for (let i = 0; i < 3; i++ ) {
    membersData.push("Andrea")
    membersData.push("Amanda")
    membersData.push("Jocelyn")
    membersData.push("Victor")
    membersData.push("Sanjana")
    membersData.push("Zaynab")
  }

  let bookClubPostsData = [];
  for (let i = 0; i < 20; i++ ) {
      let user = "Amanda Ha";
      let club = bookData.title;
      let title = "Fan theory " + i;
      let content = "Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving chicken and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and pepper, and cook, stirring often until thickened and fragrant, about 10 minutes. Add saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.";
      bookClubPostsData.push({user, club, title, content})
  }

  return (

    <Box sx={{ width: '75%', margin: '0 auto' }}>
    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      <Grid item xs={12}>
        <div className="book-club-info">
          <BookProfile/>
        </div>
      </Grid>
      <Grid item xs={8}>
        <PostFeed postsData={bookClubPostsData} />
      </Grid>
      <Grid item xs={4}>
        <Button
          sx={{ width: '100%', marginBottom: '1rem' }}
          variant="contained">
            Join the club
        </Button>
        <Typography>
          Members
        </Typography>
        <PeopleList peopleData={membersData}/>
      </Grid>

    </Grid>
  </Box>

  );
};