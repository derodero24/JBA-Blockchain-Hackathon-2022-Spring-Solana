import Button from "@mui/material/Button";
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';


import nft1_img from "../img/test1.png";
import nft2_img from "../img/test2.png";
import nft3_img from "../img/test2.png";
import slide1 from "../img/test_gif.gif";

import Grid from '@mui/material/Grid';

import YourSlide from "./your_slide_card";


function YourSlidePage(){
  
    return(
        <div>
        <Grid container alignItems="center" justifyContent="center">
            <Box>
            </Box>
      </Grid>
                  <Box margin={5}>
                  <YourSlide name={"First Slide"}
                           img_url={slide1}
                           id={1}/>
                  </Box>
         </div>
    
    )
}

export default YourSlidePage;