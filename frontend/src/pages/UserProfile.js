import React from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';
import UserProfileBanner from '../components/Banners/UserProfileBanner';
import BookList from '../components/Lists/BookList';
import PeopleList from '../components/Lists/PeopleList';
import CreatePost from "../components/Posts/CreatePost";
import PostFeed from '../components/Posts/PostFeed';
import Button from '@mui/material/Button';



function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function UserProfile() {
  let clickedUserData = JSON.parse(sessionStorage.clickedUser)
  let yourUserData = JSON.parse(sessionStorage.yourUser)
  const [value, setValue] = React.useState(0);
  const [showFollowersModal, setShowFollowersModal] = React.useState(false);
  const [showFollowingModal, setShowFollowingModal] = React.useState(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    boxShadow: 24,
    outline: 'none',
    p: 4,
  };

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
    let title = i % 3 == 0? "Spoiler Review" : i % 3 == 1? "Book Recomendations 2023" : "Hot take on chapter 3" ;
    let content = "Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving chicken and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and pepper, and cook, stirring often until thickened and fragrant, about 10 minutes. Add saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.";
    let tag = i % 3 == 0? "Spoiler" : i % 3 == 1? "Recomendation" : "Opinion" ;
    likedPostsData.push({user, club, title, content, tag})
  }

  let bookClubsJoinedData = [];
  for (let i = 0; i < 10; i++ ) {
    // let book = searchResultsBooks.docs[i];
    let title = "Harry Potter Fake"
    let author = "Jk Rowling"
    let coverUrl = "";
    bookClubsJoinedData.push({title, author, coverUrl})
  }

  let followersData = [];
  for (let i = 0; i < 1; i++ ) {
    followersData.push("Andrea")
    followersData.push("Amanda")
    followersData.push("Jocelyn")
  }

  let followingData = [];
  for (let i = 0; i < 1; i++ ) {
    followingData.push("Jocelyn")
    followingData.push("Victor")
    followingData.push("Sanjana")
    followingData.push("Zaynab")
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
    <Box sx={{ width: '70%', margin: '0 auto' }}>
    <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      <Grid item xs={12}>
        <UserProfileBanner/>
        <Button onClick={() => setShowFollowersModal(true)}>{999 + " Followers"}</Button>
        <Button onClick={() => setShowFollowingModal(true)}>{881 + " Following"}</Button>
        {clickedUserData === yourUserData? <Button variant="outlined">Edit Profile</Button>: <Button variant="outlined">Follow</Button> }
      </Grid>
      <Grid item xs={8}>
        {clickedUserData === yourUserData? <CreatePost/> : <></> }
      </Grid>
      <Grid item xs={8}>
        <Stack sx={{ marginBottom: '5rem' }} spacing={2}>
          <Box>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Posts" {...a11yProps(0)} />
                <Tab label="Liked Posts" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <PostFeed postsData={userPostsData} />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <PostFeed postsData={likedPostsData} />
            </TabPanel>
          </Box>
        </Stack>
      </Grid>
      <Grid item xs={4}>
        <Typography>
          Book Clubs
        </Typography>
         <BookList bookData={bookClubsJoinedData}/>
      </Grid>
    </Grid>
  </Box>

  <Modal
    open={showFollowersModal}
    onClose={() => setShowFollowersModal(false)}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <Box sx={style}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Followers
      </Typography>
      <PeopleList peopleData={followersData}/>
    </Box>
  </Modal>

  <Modal
    open={showFollowingModal}
    onClose={() => setShowFollowingModal(false)}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <Box sx={style}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Following
      </Typography>
      <PeopleList peopleData={followingData}/>
    </Box>
  </Modal>
  </>

  );
};