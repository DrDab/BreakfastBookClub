import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import UserProfile from "./pages/UserProfile";
import BookClub from './pages/BookClub';


function App() {
  let clickedUser = JSON.parse(sessionStorage.clickedUser||'{"name":"John", "age":30, "car":null}')
  let book = JSON.parse(sessionStorage.book||'{"name":"John", "age":30, "car":null}')

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="search-results" element={<SearchResults />} />
            <Route path={"user-profile/"+clickedUser} element={<UserProfile />} />
            <Route path={"book-club"+book.key} element={<BookClub />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;