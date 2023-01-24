import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import BookList from '../components/Lists/BookList';
import PeopleList from '../components/Lists/PeopleList';
import Stack from '@mui/material/Stack';


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

export default function SearchResults() {
  const [value, setValue] = React.useState(0);
  const [searchResultsBooks, setSearchResultsBooks] = useState("");

  useEffect(() => {
    const handleFetch = async () => {
      let searchQuery = "http://openlibrary.org/search.json?q=" + sessionStorage.searchValue.replace(/ /g, '+') + "&limit=20" // ex searchQuery: http://openlibrary.org/search.json?q=the+lord+of+the+rings
      try {
        const response = await fetch(searchQuery);
        const json = await response.json();
        setSearchResultsBooks(json)
      } catch (error) {
        console.log("error", error);
      }
    }
    handleFetch();
}, []);

  let searchResultBookData = [];
  if (searchResultsBooks !== "") {
    for (let i = 0; i < searchResultsBooks.docs.length; i++ ) {
      let book = searchResultsBooks.docs[i];
      let key = book.key;
      let title = book.title;
      let author = book.author_name;
      let coverUrl = book.cover_i ? "https://covers.openlibrary.org/b/id/" + book.cover_i  + "-M.jpg" : "";
      searchResultBookData.push({key, title, author, coverUrl})
    }
  }

  let searchResultPeopleData = [];
  for (let i = 0; i < 1; i++ ) {
    searchResultPeopleData.push("Andrea")
    searchResultPeopleData.push("Amanda")
    searchResultPeopleData.push("Jocelyn")
    searchResultPeopleData.push("Victor")
    searchResultPeopleData.push("Sanjana")
    searchResultPeopleData.push("Zaynab")
  }
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Stack sx={{ width: '70%', margin: '0 auto', marginBottom: '5rem' }} spacing={2}>
      <Typography>{"Showing search results for '" + sessionStorage.searchValue + "'"}</Typography>
      <Box sx={{ width: '70%', margin: '0 auto' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Books" {...a11yProps(0)} />
            <Tab label="People" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <BookList bookData={searchResultBookData}/>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <PeopleList peopleData={searchResultPeopleData}/>
        </TabPanel>
      </Box>
    </Stack>
  );
}
