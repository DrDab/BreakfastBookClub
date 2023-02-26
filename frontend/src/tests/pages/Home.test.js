import React from "react";
import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import Home from '../../webapp/pages/Home';
import { MemoryRouter } from 'react-router-dom';

const mockLoggedInUser = {
  "uid": "EHDvyZymtRSbciB7uXHv1mN5O9r2",
  "username": "Amanda"
}

const mockGetPosts = {
  "posts" : [
    {
      "post_id": "05c59ca8-eb13-348a-9ea8-d44c07069884",
      "book": {
          "book_id": "OL19732624W",
          "title": "The terminal list",
          "author": "Carr, Jack",
          "thumbnail": "https://covers.openlibrary.org/b/id/9245342-M.jpg"
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

const mockGetPopularBooks = {
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

describe("Renders Home page", () => {

  it("Renders posts and popular books", async () => {
    sessionStorage.setItem('loggedinUser', JSON.stringify(mockLoggedInUser));

    const makeFetchResponse = value => ({ json: async() => value })
    const mockFetch = jest.fn()
      .mockReturnValueOnce(makeFetchResponse(mockGetPopularBooks))
      .mockReturnValueOnce(makeFetchResponse(mockGetPosts))
    global.fetch = mockFetch

    await act(async () => {
      render(
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      )
    });

    expect(mockFetch).toHaveBeenCalledTimes(2);

    const postTitle = screen.queryByText(mockGetPosts.posts[0].title);
    const postBody = screen.queryByText(mockGetPosts.posts[0].post);
    expect(postTitle).toBeInTheDocument();
    expect(postBody).toBeInTheDocument();

    const bookTitle = screen.queryByText(mockGetPopularBooks.docs[0].title);
    const bookAuthor = screen.queryByText(mockGetPopularBooks.docs[0].author_name);
    expect(bookTitle).toBeInTheDocument();
    expect(bookAuthor).toBeInTheDocument();

    global.fetch.mockRestore();
  })
});
