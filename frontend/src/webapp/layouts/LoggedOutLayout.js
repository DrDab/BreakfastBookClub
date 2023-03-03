import React from "react";
import LoggedOutAppBar from '../components/AppBars/LoggedOutAppBar';
import {Outlet} from 'react-router-dom';
import Box from '@mui/material/Box';

export default function LoggedOutLayout(props) {
  return (
    <>
      <LoggedOutAppBar />
      <Box sx={{marginTop: '10rem'}}>
        <Outlet />
      </Box>
    </>
  );
};