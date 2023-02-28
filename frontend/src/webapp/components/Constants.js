import NewReleasesIcon from '@mui/icons-material/NewReleases';
import LightbulbCircleRoundedIcon from '@mui/icons-material/LightbulbCircleRounded';
import ContactlessRoundedIcon from '@mui/icons-material/ContactlessRounded';

// post feed and create post
export const tagsList = [
  {icon: <ContactlessRoundedIcon/>, label:"Discussion", color:"secondary"},
  {icon: <NewReleasesIcon/>, label:"Spoiler", color:"warning"},
  {icon: <LightbulbCircleRoundedIcon/>, label:"Theory", color:"success"}
]

export const avatarColorMap = new Map();
avatarColorMap.set('Amanda', "#32746D");
avatarColorMap.set('VictorD', "#E29578");
avatarColorMap.set('zaynab', "#C2095A");
avatarColorMap.set('AndreaH', "#260494");