import * as React from 'react';
import Typography from '@mui/material/Typography';
import PostListSkeleton from '../Skeletons/PostListSkeleton';
import Post from '../Post';

export default function PostList(props) {
	return (
    props.postsData === "" ? 
      <PostListSkeleton/> :
      Array.isArray(props.postsData) && props.postsData.length === 0? 
        <Typography variant="body2"> No posts yet </Typography>:
        props.postsData.map((post, index) => {
          return (
            <Post key={index} post={post} />
          )
        })
  );
}