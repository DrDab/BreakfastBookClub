import { render, fireEvent, screen } from "@testing-library/react";
import SearchResults from '../../webapp/pages/SearchResults';
import { MemoryRouter } from 'react-router-dom';

const mockUser = "Amanda"; 
const mockSearchValue = "Wonder";

test("Search results page renders correctly", () => {
  sessionStorage.setItem('yourUser', JSON.stringify(mockUser));
  sessionStorage.setItem('searchValue', JSON.stringify(mockSearchValue));
  render(
    <MemoryRouter>
      <SearchResults />
    </MemoryRouter>
  );
});