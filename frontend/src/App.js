import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import UserProfile from "./pages/UserProfile";
import BookClub from './pages/BookClub';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="search-results" element={<SearchResults />} />
            <Route path="user-profile" element={<UserProfile />} />
            <Route path="book-club" element={<BookClub />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;