import React from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Stack from '@mui/material/Stack';
import UserProfileBanner from '../components/Banners/UserProfileBanner';
import BookList from '../components/Lists/BookList';
import CreatePost from "../components/CreatePost";
import PostFeed from '../components/PostFeed';
import TabPanel from "../components/TabPanel";
import { a11yProps } from '../components/Utils';
import { useParams } from "react-router-dom";

export default function UserProfile() {
  let { uid } = useParams();

  let clickedUserData = uid  // will have user object here get(uid)
  let yourUserData = JSON.parse(sessionStorage.yourUser)

  const [tabIndexValue, setTabIndexValue] = React.useState(0);

  let userPostsData = [];
  for (let i = 0; i < 20; i++ ) {
      let user = clickedUserData;
      let club = "harry potter";
      let title = "Spoiler for chapter " + i;
      let content = "Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving chicken and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and pepper, and cook, stirring often until thickened and fragrant, about 10 minutes. Add saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.";
      let tag = "Spoiler"
      userPostsData.push({user, club, title, content, tag})
  }

  let likedPostsData = [];
  for (let i = 0; i < 20; i++ ) {
    let user = i % 3 == 0? "Andrea" : i % 3 == 1? "Jocelyn" : "Victor" ;
    let club = i % 3 == 0? "Wonder" : i % 3 == 1? "Twilight New Moon" : "Harry Potter and the Goblet of Fire" ;
    let title = i % 3 == 0? "Spoiler Review" : i % 3 == 1? "Book Recommendations 2023" : "Hot take on chapter 3" ;
    let content = "Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving chicken and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and pepper, and cook, stirring often until thickened and fragrant, about 10 minutes. Add saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.";
    let tag = i % 3 == 0? "Spoiler" : i % 3 == 1? "Theory" : "Discussion" ;
    likedPostsData.push({user, club, title, content, tag})
  }

  let bookClubsJoinedData = [];
  for (let i = 0; i < 6; i++ ) {
    // let book = searchResultsBooks.docs[i];
    let key = "/works/000000"
    let title = "Harry Potter Fake"
    let author = "Jk Rowling"
    let coverUrl = "";
    bookClubsJoinedData.push({key, title, author, coverUrl})
  }

  let booksFavoritedData = [];
  for (let i = 0; i < 5; i++ ) {
    // let book = searchResultsBooks.docs[i];
    let key = "/works/000000"
    let title = "Harry Potter Fake"
    let author = "Jk Rowling"
    let coverUrl = "";
    booksFavoritedData.push({key, title, author, coverUrl})
  }

  let friendsData = [];
  for (let i = 0; i < 1; i++ ) {
    friendsData.push("Andrea")
    friendsData.push("Amanda")
    friendsData.push("Jocelyn")
  }

  return (
    <>
    <Box sx={{ width: '70%', margin: '0 auto' }}>
    <Grid container rowSpacing={5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      <Grid item xs={12}>
        <UserProfileBanner clickedUserData={clickedUserData} friendsData={friendsData}/>
      </Grid>
      <Grid item xs={8}>
        {clickedUserData === yourUserData? <CreatePost/> : <></> }
        <Stack sx={{ marginBottom: '5rem' }} spacing={2}>
          <Box>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabIndexValue} onChange={(e, newIndexValue) => setTabIndexValue(newIndexValue)} aria-label="basic tabs example">
                <Tab label="Posts" {...a11yProps(0)} />
                <Tab label="Liked Posts" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <TabPanel value={tabIndexValue} index={0}>
              <PostFeed postsData={userPostsData} />
            </TabPanel>
            <TabPanel value={tabIndexValue} index={1}>
              <PostFeed postsData={likedPostsData} />
            </TabPanel>
          </Box>
        </Stack>
      </Grid>
      <Grid item xs={4}>
        <Stack spacing={2}>
          <div>
            <Typography variant="overline">
              Book Clubs
            </Typography>
            <BookList bookData={bookClubsJoinedData} />
          </div>
          <div>
            <Typography variant="overline">
              Saved Books
            </Typography>
            <BookList bookData={booksFavoritedData} />
          </div>
        </Stack>
      </Grid>
    </Grid>
  </Box>
  </>
  );
};