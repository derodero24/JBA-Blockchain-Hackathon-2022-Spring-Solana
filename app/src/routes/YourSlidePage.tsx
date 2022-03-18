import { Box, Grid } from '@mui/material';

import YourSlideCard from '../components/YourSlideCard';

export function YourSlidePage() {
  return (
    <div>
      <Grid container alignItems='center' justifyContent='center'>
        <Box></Box>
      </Grid>
      <Box margin={5}>
        <YourSlideCard
          name={'First Slide'}
          img_url={'https://ipfs.io/ipfs/QmU9qsoRQy9zkxDmZJ2tsU7tsUBQzKhWQieUsGgXZWTyaH'}
          id={1}
        />
      </Box>
    </div>
  );
}
