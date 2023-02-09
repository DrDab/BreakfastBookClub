import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import ListItemIcon from '@mui/material/ListItemIcon';
import InputBase from '@mui/material/InputBase';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EggAltOutlinedIcon from '@mui/icons-material/EggAltOutlined';
import SearchIcon from '@mui/icons-material/Search';
import Logout from '@mui/icons-material/Logout';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Link as RouterLink, useNavigate } from "react-router-dom";
import NotificationList from '../Lists/NotificationList';
import Badge from '@mui/material/Badge';
import { signOut } from "firebase/auth";
import { auth } from "../../../FirebaseConfig"

export default function LoggedInAppBar() {
  let yourUserData = JSON.parse(sessionStorage.yourUser)

  let notificationData = [];
  for (let i = 0; i < 3; i++) {
    notificationData.push({recommender: "Andrea", time: "2h", book: {
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

    notificationData.push({recommender: "Victor", time: "1h", book: {
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
  const [anchorElNotifications, setAnchorElNotifications] = React.useState(null);
  const openNotifications = Boolean(anchorElNotifications);
  const [anchorElAccount, setAnchorElAccount] = React.useState(null);
  const openAccount = Boolean(anchorElAccount);

  const navigate = useNavigate();

  const handleSearchSubmission = () => {
    sessionStorage.setItem('searchValue', searchValue);
    navigate("/search-results");
  };

  const handleLogOut = () => {
    signOut(auth);
    sessionStorage.setItem('yourUser', JSON.stringify("loggedout"));
    navigate("/log-in");
    window.location.reload();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar elevation={0} position="fixed" sx={{backgroundColor: '#ffffff'}}>
        <Toolbar>
          <Link component={RouterLink} to="/">
            <IconButton size="large" edge="start" aria-label="icon">
              <EggAltOutlinedIcon sx={{ color: '#ffa925' }} />
            </IconButton>
          </Link>
          <Typography variant="h6" sx={{ color: '#000000' }}>
            The Breakfast Book Club
          </Typography>
          <div className='search-box'>
            <div className='search-icon'>
              <SearchIcon />
            </div>
            <form onSubmit={handleSearchSubmission}>
              <InputBase
                className='search-input'
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                onChange={e => setSearchValue(e.target.value)}
                value={searchValue || ""}
              />
            </form>
          </div>
          <Box sx={{ flexGrow: 1 }} />
          <Stack direction="row" spacing={2}>
            <IconButton
              size="large"
              edge="end"
              aria-label="notifications"
              aria-controls="notification icon"
              aria-haspopup="true"
              onClick={(e) => setAnchorElNotifications(e.currentTarget)}
              sx={{width: 60, height: 60 }}
            >
              <Badge badgeContent={notificationData.length} color="error">
                <NotificationsNoneOutlinedIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="profile-icon"
              aria-haspopup="true"
              color="secondary"
              onClick={(e) => setAnchorElAccount(e.currentTarget)}
            >
              <Avatar sx={{bgcolor: red[500]}}>{yourUserData.charAt(0)}</Avatar>
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorElAccount}
        open={openAccount}
        onClose={() => setAnchorElAccount(null)}
        PaperProps={{
          sx: {
            maxHeight: 100,
            width: '13ch'
          },
        }}
      >
        <MenuItem component={RouterLink} to={"/user-profile/" + yourUserData}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleLogOut}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={anchorElNotifications}
        open={openNotifications}
        onClose={() => setAnchorElNotifications(null)}
        PaperProps={{
          style: {
            maxHeight: 250,
            width: '40ch'
          },
        }}
      >
        <Stack direction="row" justifyContent="space-between" m={1.5}>
          <Typography>
            Notifications
          </Typography>
          <Link component="button" variant="caption" onClick={()=> console.log("clear notifs")}>
            Clear
          </Link>
        </Stack>
        <NotificationList notificationData={notificationData}/>
      </Menu>
    </Box>
  );
}