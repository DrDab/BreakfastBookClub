import React from "react";
import LoggedInAppBar from '../components/AppBars/LoggedInAppBar';
import {Outlet} from 'react-router-dom';
import Box from '@mui/material/Box';

export default function LoggedInLayout(props) {
  return (
    <>
      <LoggedInAppBar />
      <Box sx={{marginTop: '7rem'}}>
        <Outlet />
      </Box>
    </>
  );
};