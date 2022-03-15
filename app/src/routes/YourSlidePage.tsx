import { Box, Grid } from '@mui/material';

import YourSlideCard from '../components/YourSlideCard';
import slide1 from '../img/test_gif.gif';

export function YourSlidePage() {
  return (
    <div>
      <Grid container alignItems='center' justifyContent='center'>
        <Box></Box>
      </Grid>
      <Box margin={5}>
        <YourSlideCard name={'First Slide'} img_url={slide1} id={1} />
      </Box>
    </div>
  );
}
