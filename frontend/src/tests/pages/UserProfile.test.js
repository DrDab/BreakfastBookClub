import { render, fireEvent, screen } from "@testing-library/react";
import UserProfile from '../../webapp/pages/UserProfile';
import {MemoryRouter, Routes, Route  } from 'react-router-dom';

const mockUser = "Amanda";

test("User Profile page renders correctly", () => {
  sessionStorage.setItem('yourUser', JSON.stringify(mockUser));
  const route = "/user-profile/" + mockUser;
  render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="user-profile/:uid" element={<UserProfile />}/>
      </Routes>
    </MemoryRouter>
  );
});