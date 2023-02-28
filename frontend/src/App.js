import './App.css';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoggedInLayout from "./webapp/layouts/LoggedInLayout";
import LoggedOutLayout from "./webapp/layouts/LoggedOutLayout";
import Home from "./webapp/pages/Home";
import SearchResults from "./webapp/pages/SearchResults";
import UserProfile from "./webapp/pages/UserProfile";
import BookClub from './webapp/pages/BookClub';
import LogIn from './webapp/pages/LogIn';
import SignUp from './webapp/pages/SignUp';

function App() {
  const loggedOut = sessionStorage?.loggedinUser === undefined || sessionStorage.loggedinUser === JSON.stringify("loggedout");

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {loggedOut ? 
            <Route path="/" element={<LoggedOutLayout />}>
              <Route index element={<LogIn />} />
              <Route path="log-in" element={<LogIn />} />
              <Route path="sign-up" element={<SignUp />} />
            </Route> :
            <Route path="/" element={<LoggedInLayout />}>
              <Route index element={<Home />} />
              <Route path="search-results" element={<SearchResults />} />
              <Route path="user-profile/:uid" element={<UserProfile />} />
              <Route path="book-club/:bid" element={<BookClub />} />
            </Route>
          }
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;