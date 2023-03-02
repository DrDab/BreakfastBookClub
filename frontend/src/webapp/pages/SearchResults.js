import React, { useState, useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import BookList from '../components/Lists/BookList';
import PeopleList from '../components/Lists/PeopleList';
import Stack from '@mui/material/Stack';
import TabPanel from "../components/TabPanel";
import { a11yProps, formatOpenLibraryData, handleGetFetch } from '../components/Utils';

export default function SearchResults() {
  const [tabIndexValue, setTabIndexValue] = React.useState(0);
  const [searchResultBookData, setSearchResultBookData] = useState("");
  const [searchResultUsersData, setSearchResultUsersData] = useState("");
  
  useEffect(() => {
    const handleFetchSearchBooks = async () => {
      let query = "http://openlibrary.org/search.json?q=" + sessionStorage.searchValue.replace(/ /g, '+') + "&limit=20";
      try {
        const response = await fetch(query);
        const json = await response.json();
        let formattedData = formatOpenLibraryData(json);
        setSearchResultBookData(formattedData);
      } catch (error) {
        console.log("error", error);
      }
    }
    handleFetchSearchBooks();

    // handleGetFetch("search_users?username=" + sessionStorage.searchValue).then((json) => {
    //   setSearchResultUsersData(json.users);
    // });
    setSearchResultUsersData([
      {
        "uid": "EHDvyZymtRSbciB7uXHv1mN5O9r2",
        "username": "Amanda",
        "bio": "bio"
      },
      {
        "uid": "sjzbuujj2hNljqVFpfJAplzXxjH3",
        "username": "VictorD",
        "bio": "bio"
      },
      {
        "uid": "DzS5RTEdqCTCafUtiw3YGMWKJUw1",
        "username": "zaynab",
        "bio": "bio"
      }
    ])
  }, []);

  return (
    <Stack sx={{ width: '70%', margin: '0 auto', marginBottom: '5rem' }} spacing={2}>
      <Typography>{"Showing search results for '" + sessionStorage.searchValue + "'"}</Typography>
      <Box sx={{ width: '70%', margin: '0 auto' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabIndexValue} onChange={(e, newIndexValue) => setTabIndexValue(newIndexValue)} aria-label="basic tabs example">
            <Tab label="Books" {...a11yProps(0)} />
            <Tab label="People" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={tabIndexValue} index={0}>
          <BookList bookData={searchResultBookData} isFromOpenLibrary />
        </TabPanel>
        <TabPanel value={tabIndexValue} index={1}>
          <PeopleList peopleData={searchResultUsersData}/>
        </TabPanel>
      </Box>
    </Stack>
  );
}
