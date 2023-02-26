import { render } from "@testing-library/react";
import SignUp from '../../webapp/pages/SignUp';
import { MemoryRouter } from 'react-router-dom';

test("Renders Sign up page, no user", () => {
  render(
    <MemoryRouter>
      <SignUp />
    </MemoryRouter>
  );
});