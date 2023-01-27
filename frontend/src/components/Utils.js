export const goToUserProfile = async (user, navigate) => {
  navigate("/user-profile/" + user)
  window.location.reload();
};

export const goToBookClub = async (book, navigate) => {
  console.log("go to book")
  sessionStorage.setItem('book', JSON.stringify(book)); // should not need after book api is done
  navigate("/book-club/" + book.key.split("/")[2]);
  window.location.reload();
};