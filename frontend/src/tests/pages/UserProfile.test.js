import React from "react";
import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import UserProfile from '../../webapp/pages/UserProfile';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

const mockLoggedInUser = {
  "uid": "EHDvyZymtRSbciB7uXHv1mN5O9r2",
  "username": "Amanda"
}

// saved books, book clubs
const mockGetBooks = { 
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

// user posts, liked posts
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
        "bio": "",
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

const mockGetUser = {
  "user": {
    "userId": "sjzbuujj2hNljqVFpfJAplzXxjH3",
    "username": "VictorD",
    "bio": "Victor's bio"
  }
};

describe("Renders User Profile page", () => { 

  test("Renders posts, user profile, book clubs, saved books", async () => {
    sessionStorage.setItem('loggedinUser', JSON.stringify(mockLoggedInUser));

    const makeFetchResponse = value => ({ json: async() => value })
    const mockFetch = jest.fn()
      .mockReturnValueOnce(makeFetchResponse(mockGetBooks))
      .mockReturnValueOnce(makeFetchResponse(mockGetBooks))
      .mockReturnValueOnce(makeFetchResponse(mockGetPosts))
      .mockReturnValueOnce(makeFetchResponse(mockGetPosts))
      .mockReturnValueOnce(makeFetchResponse(mockGetUser))
    global.fetch = mockFetch

    await act(async () => {
      const route = "/user-profile/" + mockGetUser.user.uid;
      render(
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path="user-profile/:uid" element={<UserProfile />}/>
          </Routes>
        </MemoryRouter>
      );
    });

    expect(mockFetch).toHaveBeenCalledTimes(5);

    const userName = screen.getAllByText(mockGetUser.user.username)[0];
    const userBio = screen.queryByText(mockGetUser.user.bio);
    expect(userName).toBeInTheDocument();
    expect(userBio).toBeInTheDocument();

    global.fetch.mockRestore();
    
  })
});
  