import React from "react";
import {Outlet} from "react-router-dom";
import CustomAppBar from "./components/CustomAppBar";

export default function Layout(props) {
  return (
    <>
      <CustomAppBar />
      <Outlet />
    </>
  );
};