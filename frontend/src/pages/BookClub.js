import React from "react";
import BookInfo from '../components/bookClubPageComponents/BookInfo';
import MembersList from '../components/bookClubPageComponents/MembersList';
import MainFeed from '../components/homePageComponents/MainFeed';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

export default function BookClub(props) {
  return (

    <Box sx={{ width: '75%', margin: '0 auto' }}>
    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      <Grid item xs={12}>
        <div className="book-club-info">
          <BookInfo/>
        </div>
      </Grid>
      <Grid item xs={8}>
        <MainFeed/>
      </Grid>
      <Grid item xs={4}>
        <Button
          sx={{ width: '100%', marginBottom: '1rem' }}
          variant="contained">
            Join the club
        </Button>
        <Typography>
          Members
        </Typography>
        <MembersList/>
      </Grid>

    </Grid>
  </Box>

  );
};