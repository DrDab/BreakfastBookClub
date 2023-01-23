import React from "react";

export default function UserProfile(props) {
  let userData = JSON.parse(sessionStorage.otherUser)
  return (
    <h1> {userData + "'s Profile Page"}</h1>
  );
};