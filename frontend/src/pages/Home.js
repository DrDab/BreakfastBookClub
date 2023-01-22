import React from 'react';
import PostFeed from '../components/PostFeed';

export default function Home() {
  let homePostsData = [];
  for (let i = 0; i < 20; i++ ) {
      let user = "Amanda Ha";
      let club = "Harry Potter";
      let title = "New book realease " + i;
      let content = "Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving chicken and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and pepper, and cook, stirring often until thickened and fragrant, about 10 minutes. Add saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.";
      homePostsData.push({user, club, title, content})
  }
  return (
    <>
      <div className='main-feed'>
        <PostFeed postsData={homePostsData} />
      </div>
    </>
  );
}