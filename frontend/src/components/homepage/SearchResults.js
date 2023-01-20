import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function SearchResults(props) {
	
	return (
			<Box sx={{ flexGrow: 1 }}>
				<Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ display: { xs: 'none', sm: 'block' } }}
				>
					{props.searchResults}
        </Typography>
    	</Box>
  );
}