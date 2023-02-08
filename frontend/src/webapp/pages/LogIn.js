import React from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import EggAltIcon from '@mui/icons-material/EggAlt';
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword} from "firebase/auth";

export default function LogIn() {
  let navigate = useNavigate();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isError, setIsError] = React.useState(false);


  const loginUser = async () => {
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        sessionStorage.setItem('yourUser', JSON.stringify(user.uid));
        navigate("/");
        window.location.reload();
      })
    } catch (err) {
      setIsError(true);
      setErrorMessage("Login is incorrect");
    }
  };

  return (
    <Box className="login-signup">
      <Stack spacing={2}>
        <EggAltIcon sx={{ margin: '0 auto', color: '#ffa925' }} />
        <Typography id="modal-modal-title" variant="h5" align="center">
          Welcome Back
        </Typography>
        <TextField
          InputProps={{ disableUnderline: true }}
          label="Email"
          variant="filled"
          size="small"
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          InputProps={{ disableUnderline: true }}
          label="Password"
          variant="filled"
          size="small"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        {isError &&
          <Alert severity="error">
            {errorMessage}
          </Alert>}
        <Button 
          onClick={loginUser}
          disableElevation 
          size="small" 
          variant='contained'>
          Log in
        </Button>
        <Typography variant="caption">
          New to The Breakfast Book Club?
          <Link variant="caption" component={RouterLink} to="/sign-up" ml={0.5}>
            Sign Up
          </Link>
        </Typography>
      </Stack>
    </Box>
  )
}