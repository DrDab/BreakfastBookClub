import './App.css';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoggedInLayout from "./layouts/LoggedInLayout";
import LoggedOutLayout from "./layouts/LoggedOutLayout";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import UserProfile from "./pages/UserProfile";
import BookClub from './pages/BookClub';
import LogIn from './pages/LogIn';
import SignUp from './pages/SignUp';

function App() {
  const loggedOut = sessionStorage?.yourUser === undefined || sessionStorage.yourUser === JSON.stringify("loggedout");

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