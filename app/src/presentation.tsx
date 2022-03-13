import Button from "@mui/material/Button";
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';


import nft1_img from "../img/test1.png";
import nft2_img from "../img/test2.png";
import nft3_img from "../img/test3.png";

import Grid from '@mui/material/Grid';

//import Slide from "./slide";
import Slide from "./slide";


import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';



const slidesProp = [{},{"title":"First Slide", "img":nft1_img, "msg":"I can do anything "},
                    {"title":"Second Slide", "img":nft2_img, "msg":"I can do anything "},
                    {"title":"Third Slide", "img":nft3_img, "msg":"I can do anything "}];


function Presentation(){
  const pageNum = slidesProp.length-1;
  const [page, setPage] = React.useState(1);
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  const [yourSlides, setYourSlides] = React.useState(slidesProp);
  
    return(
        <div>
          <Box margin={5}>
          <Slide title={yourSlides[page].title}
                img_url={yourSlides[page].img}
                msg={yourSlides[page].msg}
          />
          </Box>
      
        <Grid container alignItems="center" justifyContent="center">
              <Box>
              <Pagination count={pageNum} page={page} onChange={handleChange} />
              </Box>
        </Grid>
      </div>
    )
}

export default Presentation;