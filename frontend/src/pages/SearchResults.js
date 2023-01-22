import React, { useState, useEffect } from 'react';
import ResultsList from '../components/searchResultsPageComponents/ResultsList';

export default function SearchResults() {
  const [searchResults, setSearchResults] = useState("");

  useEffect(() => {
    const handleFetch = async () => {
      let searchQuery = "http://openlibrary.org/search.json?q=" + sessionStorage.searchValue.replace(/ /g, '+') + "&limit=20" // ex searchQuery: http://openlibrary.org/search.json?q=the+lord+of+the+rings
      try {
        const response = await fetch(searchQuery);
        const json = await response.json();
        setSearchResults(json)
      } catch (error) {
        console.log("error", error);
      }
    }
    handleFetch();
}, []);

  let searchResultData = [];
  if (searchResults !== "") {
    for (let i = 0; i < searchResults.docs.length; i++ ) {
      let book = searchResults.docs[i];
      let title = book.title;
      let author = book.author_name;
      let coverUrl = book.cover_i ? "https://covers.openlibrary.org/b/id/" + book.cover_i  + "-M.jpg" : "";
      searchResultData.push({title, author, coverUrl})
    }
  }

  return (
    <>
      <div className='results-list'>
        <ResultsList searchResultData={searchResultData}/>
      </div>
    </>
  );
}