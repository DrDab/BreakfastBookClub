import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Menu from '@mui/material/Menu';
import EggAltIcon from '@mui/icons-material/EggAlt';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';import AccountCircle from '@mui/icons-material/AccountCircle';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Link, useNavigate} from "react-router-dom";
import { goToUserProfile } from './Utils'
import NotificationList from '../components/Lists/NotificationList';


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const theme = createTheme({
  palette: {
    primary: {
      main: '#404eed',
    },
    secondary: {
      main: '#ffffff',
    },
  },
});


export default function CustomAppBar() {
  let yourUserData = JSON.parse(sessionStorage.yourUser)

  let notificationData = [];
  for (let i = 0; i < 3; i++) {
    notificationData.push({recommender: "Andrea", book: {
      "key": "/works/OL18417W",
      "title": "The Wonderful Wizard of Oz",
      "author": [
          "L. Frank Baum",
          "R. D. Kori",
          "Kenneth Grahame",
          "J. T. Barbarese",
          "Pablo Pino",
          "Jenny Sánchez",
          "Michael Foreman"
      ],
      "coverUrl": "https://covers.openlibrary.org/b/id/12648655-M.jpg"
    }})

    notificationData.push({recommender: "Victor", book: {
      "key": "/works/OL27479W",
      "title": "The Two Towers",
      "author": [
          "J.R.R. Tolkien"
      ],
      "coverUrl": "https://covers.openlibrary.org/b/id/8167231-M.jpg"
    }
    })
  }


  const [searchValue, setSearchValue] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const navigate = useNavigate();

  const goToSearchResults = async () => {
    sessionStorage.setItem('searchValue', searchValue);
    navigate("/search-results")
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <ThemeProvider theme={theme}>
        <AppBar className='custom-app-bar' elevation={0} position="static" color="primary">
          <Toolbar>
            <Link to="/">
              <IconButton
                size="large"
                edge="start"
                color="secondary"
                aria-label="icon"
                sx={{ mr: 2 }}
              >
                <EggAltIcon />
              </IconButton>
            </Link>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              Breakfast Book Club
            </Typography>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <form onSubmit={goToSearchResults}>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ 'aria-label': 'search' }}
                  onChange={e => setSearchValue(e.target.value)}
                  value={searchValue || ""}
                />
              </form>
            </Search>
            <Box sx={{ flexGrow: 1 }} />
            <Stack direction="row" spacing={2}>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="profile-icon"
                aria-haspopup="true"
                color="secondary"
                onClick={(e) => setAnchorEl(e.currentTarget)}
              >
                <NotificationsNoneOutlinedIcon />
              </IconButton>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="profile-icon"
                aria-haspopup="true"
                color="secondary"
                onClick={() => goToUserProfile(yourUserData, navigate)}
              >
                <AccountCircle />
              </IconButton>
            </Stack>
          </Toolbar>
        </AppBar>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={() => setAnchorEl(null)}
          PaperProps={{
            style: {
              maxHeight: 250,
              width: '40ch'
            },
          }}
        >
          <Typography ml={2} mt={1} mb={2}> Notifications </Typography>
          <NotificationList notificationData={notificationData}/>
        </Menu>
      </ThemeProvider>
    </Box>
  );
}