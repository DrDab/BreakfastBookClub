import React from "react";
import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import SearchResults from '../../webapp/pages/SearchResults';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

const mockLoggedInUser =  {
  "uid": "EHDvyZymtRSbciB7uXHv1mN5O9r2",
  "username": "Amanda",
  "bio": "bio"
}

const mockSearchValue = "The Lord of the Rings";

const mockGetSearchResultsBooks = {
  "docs": [
    {
      "key": "/works/OL27448W",
      "title": "The Lord of the Rings",
      "author_name": [
          "J.R.R. Tolkien"
      ],
      "cover_i": "https://covers.openlibrary.org/b/id/9255566-M.jpg"
    }
  ]
}

describe("Renders Search page", () => {

  it("Renders search results", async () => {
    sessionStorage.setItem('loggedinUser', JSON.stringify(mockLoggedInUser));

    const makeFetchResponse = value => ({ json: async() => value })
    const mockFetch = jest.fn()
      .mockReturnValueOnce(makeFetchResponse(mockGetSearchResultsBooks))
    global.fetch = mockFetch

    await act(async () => {
      const route = "/search-results/" + mockSearchValue;
      render(
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path="search-results/:searchTerm" element={<SearchResults />}/>
          </Routes>
        </MemoryRouter>
      )
    });

    expect(mockFetch).toHaveBeenCalledTimes(2);

    const bookTitle = screen.queryByText(mockGetSearchResultsBooks.docs[0].title);
    const bookAuthor = screen.queryByText(mockGetSearchResultsBooks.docs[0].author_name);
    expect(bookTitle).toBeInTheDocument();
    expect(bookAuthor).toBeInTheDocument();

    global.fetch.mockRestore();
  })
});
