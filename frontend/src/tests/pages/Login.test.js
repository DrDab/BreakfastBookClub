import { render } from "@testing-library/react";
import Login from '../../webapp/pages/LogIn';
import { MemoryRouter } from 'react-router-dom';

test("Renders Login page, no user", () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
});