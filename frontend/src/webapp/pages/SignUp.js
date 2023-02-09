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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore"
import { auth, db} from "../../FirebaseConfig";

export default function SignUp() {
  let navigate = useNavigate();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isError, setIsError] = React.useState(false);

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        addDoc(collection(db, "users"), {
          uid: user.uid,
          name,
          email,
        })
        sessionStorage.setItem('yourUser', JSON.stringify(user.uid));
        navigate("/");
        window.location.reload();
      })
    } catch (err) {
      setIsError(true);
      setErrorMessage("Error when creating account");
    }
  };

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
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          InputProps={{ disableUnderline: true }}
          label="Enter Email Address"
          variant="filled"
          size="small"
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          InputProps={{ disableUnderline: true }}
          label="Create Password"
          variant="filled"
          size="small"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        {isError &&
          <Alert severity="error">
            {errorMessage}
          </Alert>}
        <Button disableElevation onClick={handleSignUp} size="small" variant='contained'>
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