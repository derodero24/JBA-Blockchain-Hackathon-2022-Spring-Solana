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

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import {mintTansuNFT} from "./interact";

function YourSlide(props) {
  const theme = useTheme();
  const [demandDesire, setDemandDesire] = React.useState("");
  const [submitDesireFlag, setSubmitDesireFlag] = React.useState(1);

  const mint=async()=>{
    const tmp = await mintTansuNFT();
  }

  return (
    <Card sx={{ maxWidth: "25%", alignContents:"center", justifyContents:"center"}}>
      <CardMedia
        component="img"
        sx={{ alignContents:"center", justifyContents:"center", margin: 5, width:"75%", height: "75%", boxShadow: 1, background: "linear-gradient(to top, #33ccff 0%, #ff66ff 100%)"}}
        image={props.img_url}
      />
        <CardContent sx={{ flex: 'auto'}}>
          <Typography component="div" variant="h4">
            {props.name}
          </Typography>
          <Grid container alignItems="center" justifyContent="center" item xs={12}>
              <Button sx={{mt:1, padding:2, margin:2, backgroundColor:"#ff8c00", "&:hover": {background: "steelblue"}}}
              variant="contained" onClick={()=>{mint()}} fullWidth>MINT</Button>
          </Grid>
        </CardContent>
    </Card>
  );
}

export default YourSlide;