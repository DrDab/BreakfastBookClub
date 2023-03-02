import React from "react";
import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import BookClub from '../../webapp/pages/BookClub';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

const mockLoggedInUser = {
  "uid": "EHDvyZymtRSbciB7uXHv1mN5O9r2",
  "username": "Amanda",
  "bio": "bio"
}

// book club posts
const mockGetPosts = {
  "posts" : [
    {
      "post_id": "05c59ca8-eb13-348a-9ea8-d44c07069884",
      "book": {
        "book_id": "OL18417W",
        "title": "The Wonderful Wizard of Oz",
        "author": "L. Frank Baum",
        "thumbnail": "https://covers.openlibrary.org/b/id/12648655-M.jpg"
      },
      "user": {
        "userId": "sjzbuujj2hNljqVFpfJAplzXxjH3",
        "username": "VictorD",
        "bio": "bio",
        "thumbnail": ""
      },
      "title": "Intense stuff!",
      "date": 1676237642355,
      "tag": "Spoiler",
      "post": "I wasn't expecting Ben to betray Reese in the end!",
      "likes": 2
    }
  ]
}

// current book club
const mockGetBook = {
  "book": {
    "book_id": "OL18417W",
    "title": "The Wonderful Wizard of Oz",
    "author": "L. Frank Baum",
    "thumbnail": "https://covers.openlibrary.org/b/id/12648655-M.jpg"
  }
};

const mockGetMembers = {
  "members": [
    {
      "userId": "sjzbuujj2hNljqVFpfJAplzXxjH3",
      "username": "VictorD",
      "bio": "Victor's bio"
    }
  ]
};

// is book club saved
const mockGetBooksSaved = {
  "books": [
      {
        "book_id": "OL1168007W",
        "title": "Animal Farm",
        "author": "George Orwell",
        "thumbnail": "https://covers.openlibrary.org/b/id/11261770-M.jpg"
      }
  ]
}

const mockGetFriends = {
  "friends": [
    {
      "userId": "sjzbuujj2hNljqVFpfJAplzXxjH3",
      "username": "VictorD",
      "bio": "Victor's bio"
    }
  ]
};

const mockGetIsPostLiked = {
  "isUserLikedPost": "1"
}



describe("Renders Book club page", () => { 

  test("Renders posts and book profile ", async () => {
    sessionStorage.setItem('loggedinUser', JSON.stringify(mockLoggedInUser));

    const makeFetchResponse = value => ({ json: async() => value })
    const mockFetch = jest.fn()
      .mockReturnValueOnce(makeFetchResponse(mockGetPosts))
      .mockReturnValueOnce(makeFetchResponse(mockGetBook))
      .mockReturnValueOnce(makeFetchResponse(mockGetMembers))
      .mockReturnValueOnce(makeFetchResponse(mockGetBooksSaved))
      .mockReturnValueOnce(makeFetchResponse(mockGetFriends))
      .mockReturnValueOnce(makeFetchResponse(mockGetFriends))
      .mockReturnValueOnce(makeFetchResponse(mockGetIsPostLiked))
      
    global.fetch = mockFetch

    await act(async () => {
      const route = "/book-club/" + mockGetBook.book.book_id;
      render(
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path="book-club/:bid" element={<BookClub />}/>
          </Routes>
        </MemoryRouter>
      );
    });

    expect(mockFetch).toHaveBeenCalledTimes(6);

    const bookTitle = screen.getAllByText(mockGetBook.book.title)[0];
    const bookAuthor = screen.queryByText(mockGetBook.book.author);
    expect(bookTitle).toBeInTheDocument();
    expect(bookAuthor).toBeInTheDocument();

    global.fetch.mockRestore();

  })
});
  
