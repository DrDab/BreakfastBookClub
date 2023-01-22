import React from 'react';
import PostFeed from '../components/PostFeed';
import PeopleList from '../components/PeopleList';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CreatePost from '../components/CreatePost';


export default function Home() {
  let homePostsData = [];
  for (let i = 0; i < 20; i++ ) {
      let user = "Amanda Ha";
      let club = "Harry Potter";
      let title = "New book realease " + i;
      let content = "Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving chicken and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and pepper, and cook, stirring often until thickened and fragrant, about 10 minutes. Add saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.";
      homePostsData.push({user, club, title, content})
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
        <Typography>
          Trending
        </Typography>
        <PeopleList peopleData={popularPeopleData}/>
      </Grid>
    </Grid>
  </Box>
  );
}