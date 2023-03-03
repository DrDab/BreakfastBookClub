import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import PeopleList from '../components/Lists/PeopleList';
import BookList from '../components/Lists/BookList';
import CreatePost from '../components/CreatePost';
import PostList from '../components/Lists/PostList';
import { handleGetFetch } from '../components/Utils';

export default function Home() {
  let loggedinUser = JSON.parse(sessionStorage.loggedinUser);

  const [homePostsData, setHomePostsData] = React.useState("");
  const [bookClubsJoinedData, setBookClubsJoinedData] = React.useState("");
  const [friendsData, setFriendsData] = React.useState("");
  const [isFetchPosts, setIsFetchPosts] = React.useState(false);

  React.useEffect(() => {
    handleGetFetch("list_feed?user_id=" + loggedinUser.uid).then((json) => {
      setHomePostsData(json.posts);
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
      </Grid>
      <Grid item xs={8}>
        <PostList postsData={homePostsData} />
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