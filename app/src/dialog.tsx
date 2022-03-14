import Button from "@mui/material/Button";
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

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

import Grid from '@mui/material/Grid';

import NFTCard from "./slide";

export interface SimpleDialogProps {
    tokenid:number;
    img_url:string;
    open: boolean;
    selectedValue: string;
    onClose: (value: string) => void;
  }
  
function DetailDialog(props: SimpleDialogProps) {
  const { onClose, selectedValue, open, img_url, tokenid } = props;
  const theme = useTheme();
const fullScreen = useMediaQuery(theme.breakpoints.down('lg'));


  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  return (
    <Dialog sx={{textAlign:"center"}} onClose={handleClose} open={open} fullScreen={fullScreen} fullWidth maxWidth={"lg"}>
       <Box
          sx={{
              justifyContent: 'space-between',
              textAlign:"center",
              flexDirection: 'row',
              display: 'flex',
              '& > :not(style)': {
              m:3,
              height: 480,
              },
          }}
          >
      <img src={img_url} height="100%"/>
      <Box sx={{textAlign:"center"}}>
      <Typography sx={{mt:20, textAlign:"center"}} variant="h2" gutterBottom>Queen of Kaguya : MiiRa #{tokenid}</Typography>
      </Box>
      </Box>
    </Dialog>
  );
}

export default DetailDialog;