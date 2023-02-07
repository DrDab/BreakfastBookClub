import { render, fireEvent, screen } from "@testing-library/react";
import SignUp from '../../webapp/pages/Signup.js';
import { MemoryRouter } from 'react-router-dom';

test("Sign up page renders correctly, no user", () => {
  render(
    <MemoryRouter>
      <SignUp />
    </MemoryRouter>
  );
});