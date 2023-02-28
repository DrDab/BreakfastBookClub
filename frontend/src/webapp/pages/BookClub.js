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
import { a11yProps, formatOpenLibraryData } from '../components/Utils';

export default function BookClub() {
  let { bid } = useParams(); // clicked book
  let loggedinUser = JSON.parse(sessionStorage.loggedinUser);

  const [tabIndexValue, setTabIndexValue] = React.useState(0);
  const [bookClubPostsData, setBookClubPostsData] = React.useState('');
  const [bookProfileData, setBookProfileData] = React.useState('');
  const [isBookClubsJoinedData, setIsBookClubsJoinedData] = React.useState(false);
  const [bookClubMembersData, setBookClubMembersData] = React.useState('');
  const [isFetchPosts, setIsFetchPosts] = React.useState(false);


  React.useEffect(() => {
    const handleFetchBookProfile = async () => {
      let query = "http://localhost:4567/api/get_book?book_key=" + bid;
      try {
        const response = await fetch(query);
        const json = await response.json();
        setBookProfileData(json.book);
      } catch (error) {
        console.log("error", error);
      }
    }

    // const handleFetchIsBookClubsJoined = async () => {
    //   let query = "http://localhost:4567/api/get_subscribed_clubs?userId=" + uid;
    //   try {
    //     const response = await fetch(query);
    //     const json = await response.json();
    //     const bookClubs = json.bookClubs;
    //     setIsBookClubsJoinedData(bookClubs.some(bookClub => bookClub.book_id === bid));
    //   } catch (error) {
    //     console.log("error", error);
    //   }
    // }


    const handleFetchIsBookClubsJoined = async () => {
      let query = "http://openlibrary.org/search.json?q=george+orwell&limit=4";
      try {
        const response = await fetch(query);
        const json = await response.json();
        let bookClubs = formatOpenLibraryData(json);
        setIsBookClubsJoinedData(bookClubs.some(bookClub => bookClub.key === ('/works/' + bid)));
      } catch (error) {
        console.log("error", error);
      }
    }

    const handleFetchBookClubsMembers = async () => {
      let query = "http://localhost:4567/api/get_members?book_key=" + bid ;
      try {
        const response = await fetch(query);
        const json = await response.json();
        const members = json.members;
        setBookClubMembersData(members);
      } catch (error) {
        console.log("error", error);
      }
    }

    handleFetchBookProfile();
    handleFetchIsBookClubsJoined();
    handleFetchBookClubsMembers();
  },[bid, loggedinUser.uid]);


  React.useEffect(() => {
    const handleFetchBookClubPosts = async () => {
      let query = "http://localhost:4567/api/get_posts?book_key=" + bid;
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
  }, [bid, isFetchPosts]);


  const handleFetchPostJoinStatus = (status) => {
    let url = "http://localhost:4567/api/" + status + "?userId=" + loggedinUser.uid + "&book_key=" + bid;
    console.log(url)
    // fetch(url, {
    //   method: 'POST',
    //   mode: 'no-cors',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    // })
    // .then((data) => {
    //   console.log('Success:', data);
    // })
    // .catch((error) => {
    //   console.log(error);
    // });

    console.log(status);
  }


  const handleJoinUnJoinBookClub = () => {
    if (isBookClubsJoinedData){
      handleFetchPostJoinStatus("unjoin_club");
    } else {
      handleFetchPostJoinStatus("join_club");
    }
    setIsBookClubsJoinedData(!isBookClubsJoinedData);

  }

  return (
    <Box sx={{ width: '70%', margin: '0 auto' }}>
    <Grid container rowSpacing={5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      <Grid item xs={12}>
        <BookClubBanner bookData={bookProfileData}/>
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
          variant={isBookClubsJoinedData ? "outlined" : "contained"}
          onClick={handleJoinUnJoinBookClub}
        >
          {isBookClubsJoinedData ? "Leave the club" : "Join the club"}
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