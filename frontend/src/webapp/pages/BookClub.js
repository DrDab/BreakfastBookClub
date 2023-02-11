import React from "react";
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import PeopleList from '../components/Lists/PeopleList';
import BookClubBanner from '../components/Banners/BookClubBanner';
import CreatePost from "../components/CreatePost";
import PostFeed from '../components/PostFeed';

export default function BookClub() {
  let bookData = JSON.parse(sessionStorage.book) // should come from our API later

  let bookClubPostsData = [];
  for (let i = 0; i < 20; i++ ) {
    let user = i % 3 == 0? "Andrea" : i % 3 == 1? "Jocelyn" : "Victor";
    let club = bookData.title;
    let title = i % 3 == 0? "Spoiler Review" : i % 3 == 1? "New Theory" : "Hot take on chapter 17" ;
    let content = 
    i % 3 == 0? "I'm in seventh grade and reading this book really changed my perspective about everyone. Wonder is a book that anyone can read at any age and not think of it as cringe and to heart warming. This is a must read on every ones list. The author puts so much detail and opinion in everyone voice. Wonder is written in a format where most characters have a voice and it really helps you understand their side of the story and their ideas/opinions. Olivia is such a good person in wonder. She sticks with August after everything he's been through, she's always by his side after 27 surgeries. Love this book so much, I could read this book five times a week and not be tired of it after years. Though the book is slightly predictable, but the author makes the rest of the students brutal towards August and near the ends of the book, almost the whole fifth grade is talking with August and being his friend.":
    i % 3 == 1? "This book is amazing! When I first read this book when Edward left everything became boring to me, so I stopped reading for a week or two. When I started reading again it all started to become better and better and I read up till midnight every day. My suggestion is to keep reading, it will get good! Other than Edward leaving for a bit it was great, read the whole series, you will love them if you love action, vampires, wolves, and romance!":
    "Being a Harry Potter fan I love Quidditch. Quidditch is a sport in the wizarding world involving a lot of excitement and thrill. Harry Potter and the Goblet of Fire has the most humor and suspense in any book I've ever read. And also, it is the book with the Quidditch World Cup. The most thrilling things happened in this book, involving The Triwizard Tournament and the rising of Lord Voldemort. Besides, it is the first book that ever mentions the existence of Albus Dumbledore's pensieve. I would recommend this book to ages eight to twelve, even though it is definitely suitable for all ages. It is a book that would make you feel you couldn't put it down."
    let tag = i % 3 == 0? "Spoiler" : i % 3 == 1? "Theory" : "Discussion";
    let likes = 200;
    let isLikedByUser = i % 3 == 0? true : i % 3 == 1? false : true;
    bookClubPostsData.push({user, club, title, content, tag, likes, isLikedByUser})
  }

  let membersData = [];
  membersData.push("Andrea")
  membersData.push("Amanda")
  membersData.push("Jocelyn")
  membersData.push("Victor")
  membersData.push("Sanjana")
  membersData.push("Zaynab")


  return (
    <Box sx={{ width: '70%', margin: '0 auto' }}>
    <Grid container rowSpacing={5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      <Grid item xs={12}>
        <BookClubBanner bookData={bookData}/>
      </Grid>
      <Grid item xs={8}>
        <div style={{marginBottom: '0.5rem'}}>
          <CreatePost/>
        </div>
        <PostFeed postsData={bookClubPostsData} />
      </Grid>
      <Grid item xs={4}>
        <Button disableElevation sx={{ width: '100%', marginBottom: '1rem' }} variant="contained">
          Join the club
        </Button>
        <Typography variant="overline">
          Members
        </Typography>
        <PeopleList peopleData={membersData}/>
      </Grid>
    </Grid>
  </Box>
  );
};