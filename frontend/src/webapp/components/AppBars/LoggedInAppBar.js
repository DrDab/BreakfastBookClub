import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
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
import { avatarColorMap } from '../Constants';
import { handleGetFetch } from '../Utils';

export default function LoggedInAppBar() {
  let loggedinUser = JSON.parse(sessionStorage.loggedinUser);

  const [recommendationData, setRecommendationData] = React.useState('');
  const [isFetchRecommendations, setIsFetchRecommendations] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState(null);
  const [anchorElNotifications, setAnchorElNotifications] = React.useState(null);
  const openNotifications = Boolean(anchorElNotifications);
  const [anchorElAccount, setAnchorElAccount] = React.useState(null);
  const openAccount = Boolean(anchorElAccount);

  const navigate = useNavigate();
  
  // recommendations
  
  React.useEffect(() => {
    let recommendations = [];

    handleGetFetch("get_recommendations?recipient_userId=" + loggedinUser.uid).then((json) => {
      for (let i = 0; i < json.recommendations.length; i++ ) {
        let rec = json.recommendations[i];
        handleGetFetch("get_user?userId=" + rec.userID).then((json) => {
          let recommender = json.user;
          handleGetFetch("get_book?book_key=" + rec.bookKey).then((json) => {
            let book = json.book;
            let recommendation = {recommender, book};
            recommendations.push(recommendation);
          })
        })
      }
    }).then(() => {
      setRecommendationData(recommendations);
    });
}, [loggedinUser.uid, isFetchRecommendations]);


  // search
  const handleSearchSubmission = () => {
    sessionStorage.setItem('searchValue', searchValue);
    navigate("/search-results");
  };

  // log out
  const handleLogOut = () => {
    signOut(auth);
    sessionStorage.setItem('loggedinUser', JSON.stringify("loggedout"));
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
              <Badge badgeContent={recommendationData.length} color="error">
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
              <Avatar sx={{bgcolor: avatarColorMap.get(loggedinUser.username)}}>{loggedinUser.username.charAt(0)}</Avatar>
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
        <MenuItem reloadDocument component={RouterLink} to={"/user-profile/" + loggedinUser.uid}>
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
        onClose={() => {
          setAnchorElNotifications(null);
          setIsFetchRecommendations(!isFetchRecommendations);
        }}
        PaperProps={{
          style: {
            maxHeight: 250,
            width: '40ch'
          },
        }}
      >
        <Typography m={1} ml={2}>
          Notifications
        </Typography>
        <NotificationList notificationData={recommendationData} />
      </Menu>
    </Box>
  );
}