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
  let yourUserId = JSON.parse(sessionStorage.yourUser);
  let { uid } = useParams(); // clicked user

  const [tabIndexValue, setTabIndexValue] = React.useState(0);
  const [booksFavorited, setBooksFavorited] = React.useState('');
  const [bookClubsJoined, setBookClubsJoined] = React.useState('');
  const [userPostsData, setUserPostsData] = React.useState('');
  const [userLikedPostsData, setUserLikedPostsData] = React.useState('');
  
  React.useEffect(() => {
    const handleFetchBooksFavorited = async () => {
      let query = "http://openlibrary.org/search.json?q=good&limit=3";
      try {
        const response = await fetch(query);
        const json = await response.json();
        setBooksFavorited(json)
      } catch (error) {
        console.log("error", error);
      }
    }
 
    const handleFetchBooksClubsJoined = async () => {
      let query = "http://openlibrary.org/search.json?q=george+orwell&limit=4";
      try {
        const response = await fetch(query);
        const json = await response.json();
        setBookClubsJoined(json)
      } catch (error) {
        console.log("error", error);
      }
    }
    
    const handleFetchUserPosts = async () => {
      let query = "http://localhost:4567/api/list_feed?uid="+ uid;
      try {
        const response = await fetch(query);
        const json = await response.json();
        setUserPostsData(json);
      } catch (error) {
        console.log("error", error);
      }
    }
    
    const handleFetchLikedPosts = async () => {
      let query = "http://localhost:4567/api/list_feed";
      try {
        const response = await fetch(query);
        const json = await response.json();
        setUserLikedPostsData(json);
      } catch (error) {
        console.log("error", error);
      }
    }

    handleFetchBooksFavorited();
    handleFetchBooksClubsJoined();
    handleFetchUserPosts();
    handleFetchLikedPosts();

  }, []);

  let userProfile = {
    "userId": uid,
    "username": uid ==='EHDvyZymtRSbciB7uXHv1mN5O9r2'? 'Amanda': uid === 'sjzbuujj2hNljqVFpfJAplzXxjH3'? 'VictorD': uid,
    "bio":"Known for roles in Marvel Cinematic Universe superhero film Shang-Chi and the Legend of the Ten Rings and HBO miniseries Irma Vep and The Undoing.",
    "thumbnail": "https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/13f2a0d585f3cd8578da0d18c36a18c4~c5_720x720.jpeg?x-expires=1676120400&x-signature=ibiscyoPcZ8jI2EcS7ccAdpXPk0%3D",
    "posts": userPostsData,
    "likedPosts": userLikedPostsData
  }


  let bookClubsJoinedData = [];
  if (bookClubsJoined !== "") {
    for (let i = 0; i < bookClubsJoined.docs.length; i++ ) {
      let book = bookClubsJoined.docs[i];
      let key = book.key;
      let title = book.title;
      let author = book.author_name;
      let coverUrl = book.cover_i ? "https://covers.openlibrary.org/b/id/" + book.cover_i  + "-M.jpg" : "";
      bookClubsJoinedData.push({key, title, author, coverUrl})
    }
  }

  let booksFavoritedData = [];  
  if (booksFavorited !== "") {
    for (let i = 0; i < booksFavorited.docs.length; i++ ) {
      let book = booksFavorited.docs[i];
      let key = book.key;
      let title = book.title;
      let author = book.author_name;
      let coverUrl = book.cover_i ? "https://covers.openlibrary.org/b/id/" + book.cover_i  + "-M.jpg" : "";
      booksFavoritedData.push({key, title, author, coverUrl})
    }
  }

  let friendsData = [];
  for (let i = 0; i < 1; i++ ) {
    friendsData.push("Andrea")
    friendsData.push("Zaynab")
    friendsData.push("Sanjana")
    friendsData.push("Jocelyn")
  }

  return (
    <>
    <Box sx={{ width: '70%', margin: '0 auto' }}>
    <Grid container rowSpacing={5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      <Grid item xs={12}>
        <UserProfileBanner clickedUserData={userProfile} friendsData={friendsData}/>
      </Grid>
      <Grid item xs={8}>
        {uid === yourUserId? <CreatePost/> : <></> }
        <Stack sx={{ marginBottom: '5rem' }} spacing={2}>
          <Box>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabIndexValue} onChange={(e, newIndexValue) => setTabIndexValue(newIndexValue)} aria-label="basic tabs example">
                <Tab label="Posts" {...a11yProps(0)} />
                <Tab label="Liked Posts" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <TabPanel value={tabIndexValue} index={0}>
            {userPostsData !== "" &&
              <PostFeed postsData={userPostsData.posts} />
            }
            </TabPanel>
            <TabPanel value={tabIndexValue} index={1}>
            {userLikedPostsData !== "" &&
              <PostFeed postsData={userLikedPostsData.posts} />
            } 
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