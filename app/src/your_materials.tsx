import Button from "@mui/material/Button";
import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from "@mui/material/TextField";

import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';


import nft1_img from "../img/test1.png";
import nft2_img from "../img/test2.png";
import nft3_img from "../img/test3.png";

import {getYourNFTs} from "./interact";

function Editor(props) {
  return (
    <Button>Make</Button>
  )

}

function YourMaterials(props) {
  const theme = useTheme();
  const [yourNFTList, setYourNFTList] = React.useState([]);
  React.useEffect(()=>{
    getMaterials();
  })

  const getMaterials = async()=>{
    const tmp = await getYourNFTs();
    setYourNFTList(tmp);
  }
  

  return (
    <div>
      {yourNFTList.map((nft)=>{
        return(
          <div key={nft.id}>
            <Paper>
              <img src={nft.img} width="25%"/>
              <Typography variant="h5" gutterBottom component="div">
                {nft.id}
              </Typography>
              <Typography variant="h5" gutterBottom component="div">
                {nft.ownerAddress}
              </Typography>
              <Typography variant="h5" gutterBottom component="div">
                {nft.tansuFee}
              </Typography>
            </Paper>
        </div>
      )
      })}
    </div>
  );
}

export default YourMaterials;