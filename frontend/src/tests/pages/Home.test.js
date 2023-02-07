import { render, fireEvent, screen } from "@testing-library/react";
import Home from '../../webapp/pages/Home';
import { MemoryRouter } from 'react-router-dom';

const mockUser = "Amanda";

test("Home page renders correctly", () => {
  sessionStorage.setItem('yourUser', JSON.stringify(mockUser));
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
});