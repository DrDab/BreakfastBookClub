export const goToUserProfile = (user, navigate) => {
  navigate("/user-profile/" + user)
  window.location.reload();
};

export const goToBookClub = (book, navigate) => {
  sessionStorage.setItem('book', JSON.stringify(book)); // should not need after book api is done
  navigate("/book-club/" + book.key.split("/")[2]);
  window.location.reload();
};

export const goToSignUp = (navigate) => {
  navigate("/sign-up");
};

export const goToLogin = (navigate) => {
  navigate("/");
};

export const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};