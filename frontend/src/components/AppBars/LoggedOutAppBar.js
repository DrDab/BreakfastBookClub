import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EggAltIcon from '@mui/icons-material/EggAlt';
import { Link, useNavigate } from "react-router-dom";
import { goToLogin, goToSignUp } from '../Utils';


export default function LoggedOutAppBar() {
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar elevation={0} position="fixed" sx={{backgroundColor: '#ffffff'}}>
        <Toolbar>
          <Link to="/">
            <IconButton
              size="large"
              edge="start"
              aria-label="icon"
              sx={{ mr: 2 }}
            >
              <EggAltIcon sx={{ color: '#ffa925' }}/>
            </IconButton>
          </Link>
          <Typography variant="h6" sx={{ flexGrow: 1, color: "#000000" }}>
            The Breakfast Book Club
          </Typography>
          <Button 
            disableElevation
            variant="outlined"
            onClick={() => goToLogin(navigate)}
          >
            Log In
          </Button>
          <Button 
            disableElevation
            variant="contained"
            sx={{ marginLeft: "1rem" }}
            onClick={() => goToSignUp(navigate) }
          >
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}