import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import EggAltOutlinedIcon from '@mui/icons-material/EggAltOutlined';
import { Link as RouterLink } from "react-router-dom";

export default function LoggedOutAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar elevation={0} position="fixed" sx={{backgroundColor: '#ffffff'}}>
        <Toolbar>
          <EggAltOutlinedIcon sx={{ color: '#ffa925', mr: 1.5 }}/>
          <Typography variant="h6" sx={{ flexGrow: 1, color: "#000000" }}>
            The Breakfast Book Club
          </Typography>
          <Link mr={1} underline="none" component={RouterLink} to="/log-in">
            <Button disableElevation variant="outlined">
              Log In
            </Button>
          </Link>
          <Link underline="none" component={RouterLink} to="/sign-up">
            <Button disableElevation variant="contained">
              Sign Up
            </Button>
          </Link>
        </Toolbar>
      </AppBar>
    </Box>
  );
}