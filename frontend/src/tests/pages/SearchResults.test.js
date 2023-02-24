import { render, fireEvent, screen } from "@testing-library/react";
import SearchResults from '../../webapp/pages/SearchResults';
import { MemoryRouter } from 'react-router-dom';

const mockUser =  {
  "uid": "EHDvyZymtRSbciB7uXHv1mN5O9r2",
  "username": "Amanda"
}

const mockSearchValue = "Wonder";

test("Search results page renders correctly", () => {
  sessionStorage.setItem('loggedinUser', JSON.stringify(mockUser));
  sessionStorage.setItem('searchValue', JSON.stringify(mockSearchValue));
  render(
    <MemoryRouter>
      <SearchResults />
    </MemoryRouter>
  );
});