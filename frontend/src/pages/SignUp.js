import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import EggAltIcon from '@mui/icons-material/EggAlt';
import { useNavigate } from "react-router-dom";
import { CustomTextField } from '../components/Inputs/CustomTextField';
import { goToLogin } from '../components/Utils';

export default function SignUp() {
  const navigate = useNavigate();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const signUpUser = () => {
    console.log("sign up", username);
  }

  return (
    <Box sx={{ width: '20%', padding: '5rem 3rem 5rem 3rem', borderRadius: '0.3rem', margin: '0 auto', backgroundColor: 'white' }}>
      <Stack spacing={2}>
        <EggAltIcon sx={{ margin: '0 auto', color: '#ffa925' }} />
        <Typography id="modal-modal-title" variant="h6" component="h2" align="center">
          Sign Up
        </Typography>
        
        <CustomTextField
          label="Create Username"
          variant="filled"
          size="small"
          onChange={(e) => setUsername(e.target.value)}
        />
        <CustomTextField
          label="Create Password"
          variant="filled"
          size="small"
          type="password"
        />
        <Button 
          onClick={signUpUser}
          disableElevation 
          size="small" 
          variant='contained'>
          Sign Up
        </Button>
        <Typography variant="caption">
          Already have an account?
          <Link
            sx={{marginLeft:'0.2rem'}}
            component="button"
            variant="caption"
            onClick={() => goToLogin(navigate)}
          >
            Login
          </Link>
        </Typography>
      </Stack>
    </Box>
  )
}