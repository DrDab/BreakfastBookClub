export const goToUserProfile = async (user, navigate) => {
  navigate("/user-profile/" + user)
  window.location.reload();
};