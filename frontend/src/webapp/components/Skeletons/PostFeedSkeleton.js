import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

export default function PostFeedSkeleton(props) {
  const posts = [...Array(5).keys()]
  return (
    posts.map((post, index) => {

      return (
        <Card key={index} elevation={0} className="post">
          <CardHeader
            avatar={
              <Skeleton animation="wave" variant="circular" width={40} height={40} />
            }
            title={
              <Skeleton animation="wave" height={14} width="60%" sx={{ marginBottom: 1 }}
            />
            }
            subheader={
              <Skeleton animation="wave" height={10} width="40%" />
            }
          />
          <CardContent>
            <React.Fragment>
              <Skeleton animation="wave" height={10} sx={{ marginBottom: 0.5 }} />
              <Skeleton animation="wave" height={10} sx={{ marginBottom: 0.5 }} />
              <Skeleton animation="wave" height={10} sx={{ marginBottom: 0.5 }} />
              <Skeleton animation="wave" height={10} sx={{ marginBottom: 0.5 }} />
              <Skeleton animation="wave" height={10} width="80%" />
            </React.Fragment>
          </CardContent>
        </Card>
      )
    }
    )
  );
}