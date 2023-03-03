import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import PeopleList from '../components/Lists/PeopleList';
import BookList from '../components/Lists/BookList';
import CreatePost from '../components/CreatePost';
import PostList from '../components/Lists/PostList';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabPanel from '../components/TabPanel';
import { a11yProps, handleGetFetch } from '../components/Utils';

export default function Home() {
  let loggedinUser = JSON.parse(sessionStorage.loggedinUser);

  const [tabIndexValue, setTabIndexValue] = React.useState(0);
  const [feedPostsData, setFeedPostsData] = React.useState("");
  const [newPostsData, setNewPostsData] = React.useState("");
  const [bookClubsJoinedData, setBookClubsJoinedData] = React.useState("");
  const [friendsData, setFriendsData] = React.useState("");
  const [isFetchPosts, setIsFetchPosts] = React.useState(false);

  React.useEffect(() => {
    handleGetFetch("list_feed?user_id=" + loggedinUser.uid).then((json) => {
      setFeedPostsData(json.posts);
    });

    handleGetFetch("get_posts").then((json) => {
      setNewPostsData(json.posts);
    });
  }, [isFetchPosts, loggedinUser.uid]);

  React.useEffect(() => {
    handleGetFetch("list_friends?user_id=" + loggedinUser.uid).then((json) => {
      setFriendsData(json.friends);
    });

    handleGetFetch("get_subscribed_clubs?userId=" + loggedinUser.uid).then((json) => {
      setBookClubsJoinedData(json.books);
    });
  }, [loggedinUser.uid]);

  return (
    <Box sx={{ width: '70%', margin: '0 auto' }}>
    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      <Grid item xs={8}>
        <CreatePost 
          setIsFetchPosts={setIsFetchPosts}
          isFetchPosts={isFetchPosts}
          bookClubs={bookClubsJoinedData}
        />
        <Stack sx={{ marginBottom: '5rem' }} spacing={2}>
          <Box>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabIndexValue} onChange={(e, newIndexValue) => setTabIndexValue(newIndexValue)} aria-label="tabs">
                <Tab label="Your Feed" {...a11yProps(0)} />
                <Tab label="Discover New" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <TabPanel value={tabIndexValue} index={0}>
              <PostList postsData={feedPostsData} setIsFetchPosts={setIsFetchPosts} isFetchPosts={isFetchPosts} />
            </TabPanel>
            <TabPanel value={tabIndexValue} index={1}>
              <PostList postsData={newPostsData} setIsFetchPosts={setIsFetchPosts} isFetchPosts={isFetchPosts} />
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
              Friends
            </Typography>
            <PeopleList peopleData={friendsData}/>
          </div>
        </Stack>
      </Grid>
    </Grid>
  </Box>
  );
}