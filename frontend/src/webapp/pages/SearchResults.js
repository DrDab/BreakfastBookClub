import React, { useState, useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import BookList from '../components/Lists/BookList';
import PeopleList from '../components/Lists/PeopleList';
import Stack from '@mui/material/Stack';
import TabPanel from '../components/TabPanel';
import { a11yProps, formatOpenLibraryData, handleGetFetchBase, handleGetFetch } from '../components/Utils';

export default function SearchResults() {
  const [tabIndexValue, setTabIndexValue] = React.useState(0);
  const [searchResultBookData, setSearchResultBookData] = useState("");
  const [searchResultUsersData, setSearchResultUsersData] = useState("");
  
  useEffect(() => {
    let route = sessionStorage.searchValue.replace(/ /g, '+') + "&limit=20";
    let url = "http://openlibrary.org/search.json?q=" + route;
    handleGetFetchBase(url).then((json) => {
      setSearchResultBookData(formatOpenLibraryData(json))
    })

    handleGetFetch("search_users?user_searchterm=" + sessionStorage.searchValue).then((json) => {
      setSearchResultUsersData(json.users);
    });
  }, []);

  return (
    <Stack sx={{ width: '70%', margin: '0 auto', marginBottom: '5rem' }} spacing={2}>
      <Typography variant="body2">
        {"Showing search results for '" + sessionStorage.searchValue + "'"}
      </Typography>
      <Box sx={{ width: '70%', margin: '0 auto' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabIndexValue} onChange={(e, newIndexValue) => setTabIndexValue(newIndexValue)} aria-label="tabs">
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
