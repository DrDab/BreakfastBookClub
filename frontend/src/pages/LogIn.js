import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import EggAltIcon from '@mui/icons-material/EggAlt';
import { useNavigate } from "react-router-dom";
import { CustomTextField } from '../components/Inputs/CustomTextField';
import { goToSignUp } from '../components/Utils';


export default function LogIn() {
  const navigate = useNavigate();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const loginUser = () => {
    sessionStorage.setItem('yourUser', JSON.stringify(username))
    window.location.reload();
  }
  return (
    <Box className="login-signup">
      <Stack spacing={2}>
        <EggAltIcon sx={{ margin: '0 auto', color: '#ffa925' }} />
        <Typography id="modal-modal-title" variant="h5" align="center">
          Welcome Back
        </Typography>
        <CustomTextField
          label="Username"
          variant="filled"
          size="small"
            onChange={(e) => setUsername(e.target.value)}
        />
        <CustomTextField
          label="Password"
          variant="filled"
          size="small"
          type="password"
        />
        <Button 
          onClick={loginUser}
          disableElevation 
          size="small" 
          variant='contained'>
          Log in
        </Button>
        <Typography variant="caption">
          New to The Breakfast Book Club?
          <Link
            sx={{marginLeft:'0.2rem'}}
            component="button"
            variant="caption"
            onClick={() => goToSignUp(navigate)}
          >
            Sign up
          </Link>
        </Typography>
      </Stack>
    </Box>
  )
}