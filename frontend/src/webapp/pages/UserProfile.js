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
import PostList from '../components/Lists/PostList'
import TabPanel from "../components/TabPanel";
import { a11yProps, handleGetFetch } from '../components/Utils';
import { useParams } from "react-router-dom";

export default function UserProfile() {
  let loggedinUser = JSON.parse(sessionStorage.loggedinUser);
  let { uid } = useParams(); // clicked user

  const [tabIndexValue, setTabIndexValue] = React.useState(0);
  const [userProfileData, setUserProfileData] = React.useState('');
  const [booksSavedData, setBooksSavedData] = React.useState('');
  const [bookClubsJoinedData, setBookClubsJoinedData] = React.useState('');
  const [userPostsData, setUserPostsData] = React.useState('');
  const [userLikedPostsData, setUserLikedPostsData] = React.useState('');
  const [friendsData, setFriendsData] = React.useState('');
  const [isFriendData, setIsFriendData] = React.useState('');
  const [isFetchPosts, setIsFetchPosts] = React.useState(false);
  const [isFetchLikedPosts, setIsFetchLikedPosts] = React.useState(false);

  React.useEffect(() => {
    handleGetFetch("get_posts?userId=" + uid).then((json) => {
      let posts = json.posts;
      posts.sort(function (a, b) {
          return b.date - a.date;
      });
      setUserPostsData(posts);
    });
  }, [uid, isFetchPosts]);


  React.useEffect(() => {
    handleGetFetch("get_liked_posts?user_id=" + uid).then((json) => {    
      let posts = json.posts;
      posts.sort(function (a, b) {
          return b.date - a.date;
      });  
      setUserLikedPostsData(posts);
    });
  }, [uid, isFetchLikedPosts]);


  React.useEffect(() => {
    handleGetFetch("get_user?userId=" + uid).then((json) => {      
      setUserProfileData(json.user);
    });

    handleGetFetch("get_saved_books?userID=" + uid).then((json) => {      
      setBooksSavedData(json.books)
    });

    handleGetFetch("get_subscribed_clubs?userId=" + uid).then((json) => {
      setBookClubsJoinedData(json.books);
    });

    handleGetFetch("list_friends?user_id=" + uid).then((json) => {
      setFriendsData(json.friends);
    });

    handleGetFetch("list_friends?user_id=" + loggedinUser.uid).then((json) => {
      setIsFriendData(json.friends.some(friend => friend.uid === uid));
    });
  }, [loggedinUser.uid, uid]);

  return (
    <>
    <Box sx={{ width: '70%', margin: '0 auto' }}>
    <Grid container rowSpacing={5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      <Grid item xs={12}>
        <UserProfileBanner 
          clickedUserData={userProfileData}
          setIsFriendData={setIsFriendData}
          isFriendData={isFriendData}
          clickedUserFriends={friendsData}
          setUserProfileData={setUserProfileData}
          userProfileData={userProfileData}
        />
      </Grid>
      <Grid item xs={8}>
        {uid === loggedinUser.uid ?
          <CreatePost 
            setIsFetchPosts={setIsFetchPosts}
            isFetchPosts={isFetchPosts}
            bookClubs={bookClubsJoinedData}
          /> :
          <></>
        }
          <Stack sx={{ marginBottom: '5rem' }} spacing={2}>
            <Box>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabIndexValue} onChange={(e, newIndexValue) => setTabIndexValue(newIndexValue)} aria-label="basic tabs example">
                  <Tab onClick={() => setIsFetchPosts(!isFetchPosts)} label="Posts" {...a11yProps(0)} />
                  <Tab onClick={() => setIsFetchLikedPosts(!isFetchLikedPosts)} label="Liked Posts" {...a11yProps(1)} />
                </Tabs>
              </Box>
              <TabPanel value={tabIndexValue} index={0}>
                <PostList postsData={userPostsData} />
              </TabPanel>
              <TabPanel value={tabIndexValue} index={1}>
                <PostList postsData={userLikedPostsData} />
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
                Saved Book Clubs
              </Typography>
              <BookList bookData={booksSavedData} />
            </div>
          </Stack>
        </Grid>
      </Grid>
    </Box>
    </>
  );
};