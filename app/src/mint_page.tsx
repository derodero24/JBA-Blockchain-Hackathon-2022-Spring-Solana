import Button from "@mui/material/Button";
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';


import nft1_img from "../img/test1.png";
import nft2_img from "../img/test2.png";
import nft3_img from "../img/test2.png";
import { Paper } from "@mui/material";

import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import { blue } from '@mui/material/colors';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
const emails = ['username@gmail.com', 'user02@gmail.com'];
import DetailDialog from "./dialog";
import Grid from '@mui/material/Grid';

import NFTCard from "./slide";
import MintCard from "./mint_card";

import Slider from '@mui/material/Slider';

import {getMaterialMarket} from "./interact";

function valuetext(value: number) {
  return `${value}°C`;
}

const minDistance = 4;

function MintPage(){
  const [mintMsg, setMintMsg] = React.useState("Please Mint");
  const [value2, setValue2] = React.useState<number[]>([0, 12]);
  const [openDialogTokenid, setOpenDialogTokenid] = React.useState(0);
  const [materialMarket, setMaterialMarket] = React.useState([]);
  React.useEffect(()=>{
    getMaterialMarketTmp();

  })
  const getMaterialMarketTmp = async () =>{
    const tmp = await getMaterialMarket();
    setMaterialMarket(tmp);
  }

return(
    <div>
      <Box sx={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                display: 'flex',
                '& > :not(style)': {
                m:6,
                width: 280,
                height: 600,
                },
              }}>
      {materialMarket.map((material)=>{
            return(
                <div key={material.id}>
                    <MintCard id={material.id}
                              ownerAddress={material.ownerAddress}
                              img_url={material.img}
                              buyPrice={material.buyPrice}
                              tansuFee={material.tansuFee}/>
                </div>
            )
        })}
        </Box>
    </div>
)

}

export default MintPage;