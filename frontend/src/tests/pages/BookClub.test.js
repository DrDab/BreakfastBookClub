import { render, fireEvent, screen } from '@testing-library/react';
import BookClub from '../../webapp/pages/BookClub';
import { MemoryRouter } from 'react-router-dom';

const mockBook = {
  "key": "/works/OL18417W",
  "title": "The Wonderful Wizard of Oz",
  "author": [
      "L. Frank Baum",
      "R. D. Kori",
      "Kenneth Grahame",
      "J. T. Barbarese",
      "Pablo Pino",
      "Jenny Sánchez",
      "Michael Foreman"
  ],
  "coverUrl": "https://covers.openlibrary.org/b/id/12648655-M.jpg"
};

const mockUser = "Amanda";
const mockToken = "Token";

test("Book club page renders correctly", () => {
  sessionStorage.setItem('book', JSON.stringify(mockBook));
  sessionStorage.setItem('yourUser', JSON.stringify(mockUser));
  sessionStorage.setItem('yourToken', JSON.stringify(mockToken));
  render(
    <MemoryRouter>
      <BookClub />
    </MemoryRouter>
  );
});
  
