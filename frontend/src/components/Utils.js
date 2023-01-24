export const goToUserProfile = async (user, navigate) => {
  sessionStorage.setItem('clickedUser', JSON.stringify(user));
  navigate("/user-profile/" + user)
  window.location.reload();
};