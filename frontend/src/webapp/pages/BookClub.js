import React from "react";
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Stack from '@mui/material/Stack';
import PeopleList from '../components/Lists/PeopleList';
import BookClubBanner from '../components/Banners/BookClubBanner';
import CreatePost from "../components/CreatePost";
import PostList from '../components/Lists/PostList';
import { useParams } from "react-router-dom";
import TabPanel from "../components/TabPanel";
import { a11yProps, handleGetFetch, handlePostFetch } from '../components/Utils';
import { auth } from "../../FirebaseConfig"

export default function BookClub() {
  let { bid } = useParams(); // clicked book
  let loggedinUser = JSON.parse(sessionStorage.loggedinUser);

  const [tabIndexValue, setTabIndexValue] = React.useState(0);
  const [bookClubPostsData, setBookClubPostsData] = React.useState('');
  const [bookProfileData, setBookProfileData] = React.useState('');
  const [isBookSavedData, setIsBookSavedData] = React.useState('');
  const [isBookClubJoinedData, setIsBookClubJoinedData] = React.useState(false);
  const [bookClubMembersData, setBookClubMembersData] = React.useState('');
  const [loggedinUserFriendsData, setLoggedinUserFriendsData] = React.useState('');
  const [isFetchPosts, setIsFetchPosts] = React.useState(false);

  React.useEffect(() => {
    handleGetFetch("get_posts?book_key=" + bid).then((json) => {
      let posts = json.posts;
      posts.sort(function (a, b) {
        return b.date - a.date;
      });
      setBookClubPostsData(posts);
    });
  }, [bid, isFetchPosts]);


  React.useEffect(() => {
    handleGetFetch("get_book?book_key=" + bid).then((json) => {      
      setBookProfileData(json.book);
    });

    handleGetFetch("get_members?book_key=" + bid).then((json) => {
      setBookClubMembersData(json.members);
    });

    handleGetFetch("list_friends?user_id=" + loggedinUser.uid).then((json) => {
      setLoggedinUserFriendsData(json.friends);
    });

    handleGetFetch("get_saved_books?userID=" + loggedinUser.uid).then((json) => {
      setIsBookSavedData(json.books.some(book => book.book_id === bid));
    });

    handleGetFetch("get_subscribed_clubs?userId=" + loggedinUser.uid).then((json) => {
      setIsBookClubJoinedData(json.books.some(bookClub => bookClub.book_id === bid));
    });
  }, [loggedinUser.uid, bid]);


  const handleJoinUnJoinBookClub = () => {
    auth.currentUser?.getIdToken(true).then(function(idToken){
      if (isBookClubJoinedData) {
        handlePostFetch("unjoin_club?token=" + idToken + "&book_key=" + bid, "").then(() => {
          handleGetFetch("get_members?book_key=" + bid).then((json) => {
            setBookClubMembersData(json.members);
          });
        })
      } else {
        handlePostFetch("join_club?token=" + idToken + "&book_key=" + bid, "").then(() => {
          handleGetFetch("get_members?book_key=" + bid).then((json) => {
            setBookClubMembersData(json.members);
          });
        })
      }
    })
    setIsBookClubJoinedData(!isBookClubJoinedData);
  }

  return (
    <Box sx={{ width: '70%', margin: '0 auto' }}>
    <Grid container rowSpacing={5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      <Grid item xs={12}>
        <BookClubBanner
          bookData={bookProfileData}
          loggedinUserFriendsData={loggedinUserFriendsData}
          setIsBookSavedData={setIsBookSavedData}
          isBookSavedData={isBookSavedData}
        />
      </Grid>
      <Grid item xs={8}>
        <CreatePost
          setIsFetchPosts={setIsFetchPosts}
          isFetchPosts={isFetchPosts}
          bookClubs={[bookProfileData]}
          isInBookClub
        />
        <Stack sx={{ marginBottom: '5rem' }} spacing={2}>
          <Box>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabIndexValue} onChange={(e, newIndexValue) => setTabIndexValue(newIndexValue)} aria-label="basic tabs example">
                <Tab label="Posts" {...a11yProps(0)} />
              </Tabs>
            </Box>
            <TabPanel value={tabIndexValue} index={0}>
              <PostList postsData={bookClubPostsData} />
            </TabPanel>
          </Box>
        </Stack>
      </Grid>
      <Grid item xs={4}>
        <Button
          disableElevation
          sx={{ width: '100%', marginBottom: '1rem' }}
          variant={isBookClubJoinedData ? "outlined" : "contained"}
          onClick={handleJoinUnJoinBookClub}
        >
          {isBookClubJoinedData ? "Leave the club" : "Join the club"}
        </Button>
        <Typography variant="overline">
          Members
        </Typography>
        <PeopleList peopleData={bookClubMembersData}/>
      </Grid>
    </Grid>
  </Box>
  );
};