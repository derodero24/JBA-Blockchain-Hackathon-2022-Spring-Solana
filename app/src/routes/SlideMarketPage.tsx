import { Box, Grid } from '@mui/material';

import slide1 from '../../img/test_gif.gif';
import SlideMarketCand from '../components/SlideMarketCand';

export function SlideMarketPage(props: { network: string }) {
  return (
    <div>
      <Grid container alignItems='center' justifyContent='center'>
        <Box></Box>
      </Grid>
      <Box margin={5}>
        <SlideMarketCand name={'First Slide'} img_url={slide1} id={1} network={props.network} />
      </Box>
    </div>
  );
}
