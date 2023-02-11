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

  let { uid } = useParams(); // clicked uid
  // /api/get_user?username={uid} 
  // return user profile of clicked user

  const [tabIndexValue, setTabIndexValue] = React.useState(0);
  const [booksFavorited, setBooksFavorited] = React.useState('');
  const [bookClubsJoined, setBookClubsJoined] = React.useState('');
  

   // user profile of clicked user from api call

  let userPostsData = [];
  for (let i = 0; i < 5; i++ ) {
      let user = uid == 'EHDvyZymtRSbciB7uXHv1mN5O9r2' ? 'Amanda': uid;
      let club = "Animal Farm";
      let title = "Theory about chapter " + (i+1);
      let content = 
      i % 3 == 0? "I had to read this book for one of my classes,It is currently my favorite book and I grew up with Harry Potter and Percy Jackson so this was a big step up from unrealistic books even though they were talking animals it actually taught me a lot about the cycle of society and where America is now.":
      i % 3 == 1? "George Orwell (Eric Arthur Blair) is a spectacular writer, and his less popular work Animal Farm is no different than his other work, 1984, in quality. It paints a great picture, and it can represent countless things, not solely the Russian Revolution. Perhaps we will continue to see parallels (Though I certainly hope not). I will never forget this book and it's universal message.":
      "A group of farm animals fight against their master Jones and gain freedom and equality.  Manor farm is thus becomes Animal farm.  But in the end Napoleon's dictatorial ruling farm gets worse than ever.  The 7 commandments given at the beginning are distorted over time. It's written in a way that all characters are animals, but it's all about human beings.  In the end, the narrator points to each of us by saying that humans and pigs are indistinguishable.";
      let tag = "Theory";
      let likes = 200;
      let isLikedByUser = i % 3 == 0? true : i % 3 == 1? false : true;
      userPostsData.push({user, club, title, content, tag, likes, isLikedByUser});
  }

  let likedPostsData = [];
  for (let i = 0; i < 10; i++ ) {
    let user = i % 3 == 0? "Sanjana" : i % 3 == 1? "Zaynab" : "Victor" ;
    let club = i % 3 == 0? "Wonder" : i % 3 == 1? "Twilight New Moon" : "Harry Potter and the Goblet of Fire" ;
    let title = i % 3 == 0? "Spoiler Review" : i % 3 == 1? "Theory about Edward" : "Hot take on chapter 3" ;
    let content = 
    i % 3 == 0? "I'm in seventh grade and reading this book really changed my perspective about everyone. Wonder is a book that anyone can read at any age and not think of it as cringe and to heart warming. This is a must read on every ones list. The author puts so much detail and opinion in everyone voice. Wonder is written in a format where most characters have a voice and it really helps you understand their side of the story and their ideas/opinions. Olivia is such a good person in wonder. She sticks with August after everything he's been through, she's always by his side after 27 surgeries. Love this book so much, I could read this book five times a week and not be tired of it after years. Though the book is slightly predictable, but the author makes the rest of the students brutal towards August and near the ends of the book, almost the whole fifth grade is talking with August and being his friend.":
    i % 3 == 1? "This book is amazing! When I first read this book when Edward left everything became boring to me, so I stopped reading for a week or two. When I started reading again it all started to become better and better and I read up till midnight every day. My suggestion is to keep reading, it will get good! Other than Edward leaving for a bit it was great, read the whole series, you will love them if you love action, vampires, wolves, and romance!":
    "Being a Harry Potter fan I love Quidditch. Quidditch is a sport in the wizarding world involving a lot of excitement and thrill. Harry Potter and the Goblet of Fire has the most humor and suspense in any book I've ever read. And also, it is the book with the Quidditch World Cup. The most thrilling things happened in this book, involving The Triwizard Tournament and the rising of Lord Voldemort. Besides, it is the first book that ever mentions the existence of Albus Dumbledore's pensieve. I would recommend this book to ages eight to twelve, even though it is definitely suitable for all ages. It is a book that would make you feel you couldn't put it down."
    let tag = i % 3 == 0? "Spoiler" : i % 3 == 1? "Theory" : "Discussion";
    let likes = 200;
    let isLikedByUser = i % 3 == 0? true : i % 3 == 1? false : true;
    likedPostsData.push({user, club, title, content, tag, likes, isLikedByUser})
  }

  let userProfile = {
    "userId": uid,
    "username": uid == 'EHDvyZymtRSbciB7uXHv1mN5O9r2'? 'Amanda': uid,
    "bio":" She is known for her roles in Marvel Cinematic Universe superhero film Shang-Chi and the Legend of the Ten Rings and HBO miniseries Irma Vep and The Undoing.",
    "thumbnail": "https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/13f2a0d585f3cd8578da0d18c36a18c4~c5_720x720.jpeg?x-expires=1676120400&x-signature=ibiscyoPcZ8jI2EcS7ccAdpXPk0%3D",
    "posts": userPostsData,
    "likedPosts": likedPostsData
  }

  React.useEffect(() => {
    const handleFetch = async () => {
      let fetchQuery = "http://openlibrary.org/search.json?q=george+orwell&limit=4";
      try {
        const response = await fetch(fetchQuery);
        const json = await response.json();
        setBookClubsJoined(json)
      } catch (error) {
        console.log("error", error);
      }
    }
    handleFetch();
}, []);

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



  React.useEffect(() => {
    const handleFetch = async () => {
      let fetchQuery = "http://openlibrary.org/search.json?q=good&limit=3";
      try {
        const response = await fetch(fetchQuery);
        const json = await response.json();
        setBooksFavorited(json)
      } catch (error) {
        console.log("error", error);
      }
    }
    handleFetch();
}, []);

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
    friendsData.push("Victor")
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