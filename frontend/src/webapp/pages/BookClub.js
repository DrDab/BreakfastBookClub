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
import { a11yProps, handleFetch } from '../components/Utils';

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
    handleFetch("get_posts?book_key=", bid).then((json) => {
      let posts = json.posts;
      posts.sort(function (a, b) {
          return b.date - a.date;
      });
      setBookClubPostsData(posts);
    });
  }, [bid, isFetchPosts]);


  React.useEffect(() => {
    handleFetch("get_book?book_key=", bid).then((json) => {      
      setBookProfileData(json.book);
    });

    handleFetch("get_members?book_key=", bid).then((json) => {
      setBookClubMembersData(json.members);
    });

    handleFetch("get_saved_books?userID=", loggedinUser.uid).then((json) => {
      setIsBookSavedData(json.books.some(book => book.book_id === bid));
    });

    // for sending reccomendations
    handleFetch("list_friends?user_id=", loggedinUser.uid).then((json) => {
      setLoggedinUserFriendsData(json.friends);
    });

    // handleFetch("get_subscribed_clubs?userId=", loggedinUser.uid).then((json) => {
    //     const bookClubs = json.bookClubs;
    //     setIsBookClubJoinedData(bookClubs.some(bookClub => bookClub.book_id === bid));
    // });
    setIsBookClubJoinedData(false);

  }, [loggedinUser.uid, bid]);



  const handleFetchPostJoinStatus = (status) => {
    // let url = "http://localhost:4567/api/" + status + "?userId=" + loggedinUser.uid + "&book_key=" + bid;
    let url = "https://example.com/"
    console.log(status);

    fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then((data) => {
      console.log('Success:', data);
      handleFetch("get_members?book_key=", bid).then((json) => {
        setBookClubMembersData(json.members);
      });
    })
    .catch((error) => {
      console.log(error);
    }); 
  }

  const handleJoinUnJoinBookClub = () => {
    if (isBookClubJoinedData){
      handleFetchPostJoinStatus("unjoin_club");
    } else {
      handleFetchPostJoinStatus("join_club");
    }
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
        <CreatePost setIsFetchPosts={setIsFetchPosts} isFetchPosts={isFetchPosts} />
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