import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import EggAltIcon from '@mui/icons-material/EggAlt';
import { Link as RouterLink } from "react-router-dom";

export default function SignUp() {

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const signUpUser = () => {
    console.log("sign up", username);
  }

  return (
    <Box className="login-signup">
      <Stack spacing={2}>
        <EggAltIcon sx={{ margin: '0 auto', color: '#ffa925' }} />
        <Typography id="modal-modal-title" variant="h5" align="center">
          Sign Up
        </Typography>
        <TextField
          InputProps={{ disableUnderline: true }}
          label="Create Username"
          variant="filled"
          size="small"
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          InputProps={{ disableUnderline: true }}
          label="Create Password"
          variant="filled"
          size="small"
          type="password"
        />
        <Button disableElevation onClick={signUpUser} size="small" variant='contained'>
          Sign Up
        </Button>
        <Typography variant="caption">
          Already have an account?
          <Link variant="caption" component={RouterLink} to="/log-in" ml={0.5}>
            Log in
          </Link>
        </Typography>
      </Stack>
    </Box>
  )
}