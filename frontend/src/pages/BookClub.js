import React from "react";

export default function BookClub(props) {
  return (
    <>
      <h1> Book Club page</h1>
      <h2>{sessionStorage.getItem('bookClub')}</h2>
    </>

  );
};