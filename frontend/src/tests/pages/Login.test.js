import { render, fireEvent, screen } from "@testing-library/react";
import Login from '../../webapp/pages/LogIn';
import { MemoryRouter } from 'react-router-dom';

test("Login page renders correctly, no user", () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
});