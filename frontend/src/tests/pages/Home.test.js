import { render, fireEvent, screen } from "@testing-library/react";
import Home from '../../webapp/pages/Home';
import { MemoryRouter } from 'react-router-dom';

const mockUser = "Amanda";
const mockToken = "Token";

test("Home page renders correctly", () => {
  sessionStorage.setItem('yourUser', JSON.stringify(mockUser));
  sessionStorage.setItem('yourToken', JSON.stringify(mockToken));
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
});