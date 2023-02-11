import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import PeopleList from '../components/Lists/PeopleList';
import BookList from '../components/Lists/BookList';
import CreatePost from '../components/CreatePost';
import PostFeed from '../components/PostFeed';

export default function Home() {
  const [popularBooks, setPopularBooks] = useState("");

  useEffect(() => {
    const handleFetch = async () => {
      let searchQuery = "http://openlibrary.org/search.json?q=lord+of+the+rings&limit=3" // ex searchQuery: http://openlibrary.org/search.json?q=the+lord+of+the+rings
      try {
        const response = await fetch(searchQuery);
        const json = await response.json();
        setPopularBooks(json)
      } catch (error) {
        console.log("error", error);
      }
    }
    handleFetch();
}, []);

  let popularBooksData = [];
  if (popularBooks !== "") {
    for (let i = 0; i < popularBooks.docs.length; i++ ) {
      let book = popularBooks.docs[i];
      let key = book.key;
      let title = book.title;
      let author = book.author_name;
      let coverUrl = book.cover_i ? "https://covers.openlibrary.org/b/id/" + book.cover_i  + "-M.jpg" : "";
      popularBooksData.push({key, title, author, coverUrl})
    }
  }
  
  let homePostsData = [];
  for (let i = 0; i < 20; i++ ) {
    let user = i % 3 == 0? "Andrea" : i % 3 == 1? "Jocelyn" : "Victor" ;
    let club = i % 3 == 0? "Wonder" : i % 3 == 1? "Twilight New Moon" : "Harry Potter and the Goblet of Fire" ;
    let title = i % 3 == 0? "Spoiler Review" : i % 3 == 1? "Theory about Edward" : "Hot take on chapter 3" ;
    let content = 
    i % 3 == 0? "I'm in seventh grade and reading this book really changed my perspective about everyone. Wonder is a book that anyone can read at any age and not think of it as cringe and to heart warming. This is a must read on every ones list. The author puts so much detail and opinion in everyone voice. Wonder is written in a format where most characters have a voice and it really helps you understand their side of the story and their ideas/opinions. Olivia is such a good person in wonder. She sticks with August after everything he's been through, she's always by his side after 27 surgeries. Love this book so much, I could read this book five times a week and not be tired of it after years. Though the book is slightly predictable, but the author makes the rest of the students brutal towards August and near the ends of the book, almost the whole fifth grade is talking with August and being his friend.":
    i % 3 == 1? "This book is amazing! When I first read this book when Edward left everything became boring to me, so I stopped reading for a week or two. When I started reading again it all started to become better and better and I read up till midnight every day. My suggestion is to keep reading, it will get good! Other than Edward leaving for a bit it was great, read the whole series, you will love them if you love action, vampires, wolves, and romance!":
    "Being a Harry Potter fan I love Quidditch. Quidditch is a sport in the wizarding world involving a lot of excitement and thrill. Harry Potter and the Goblet of Fire has the most humor and suspense in any book I've ever read. And also, it is the book with the Quidditch World Cup. The most thrilling things happened in this book, involving The Triwizard Tournament and the rising of Lord Voldemort. Besides, it is the first book that ever mentions the existence of Albus Dumbledore's pensieve. I would recommend this book to ages eight to twelve, even though it is definitely suitable for all ages. It is a book that would make you feel you couldn't put it down."
    let tag = i % 3 == 0? "Spoiler" : i % 3 == 1? "Theory" : "Discussion";
    let likes = 200;
    let isLikedByUser = i % 3 == 0? true : i % 3 == 1? false : true;
    homePostsData.push({user, club, title, content, tag, likes, isLikedByUser})
  }

  let popularPeopleData = [];
  for (let i = 0; i < 1; i++ ) {
    popularPeopleData.push("Andrea")
    popularPeopleData.push("Jocelyn")
    popularPeopleData.push("Victor")
    popularPeopleData.push("Sanjana")
    popularPeopleData.push("Zaynab")
  }

  return (
    <Box sx={{ width: '70%', margin: '0 auto' }}>
    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      <Grid item xs={8}>
        <CreatePost/>
      </Grid>
      <Grid item xs={8}>
        <PostFeed postsData={homePostsData} />
      </Grid>
      <Grid item xs={4}>
        <Stack spacing={2}>
          <div>
            <Typography variant="overline">
              Trending Books
            </Typography>
            <BookList bookData={popularBooksData}/>
          </div>
          <div>
            <Typography variant="overline">
              Trending Readers
            </Typography>
            <PeopleList peopleData={popularPeopleData}/>
          </div>
        </Stack>
      </Grid>
    </Grid>
  </Box>
  );


  
}