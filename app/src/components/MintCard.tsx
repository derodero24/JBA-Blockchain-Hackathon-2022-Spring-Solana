import * as React from 'react';

import { Box, Button, Grid, Paper, Typography } from '@mui/material';

import nft1_img from '../../img/test1.png';
import nft2_img from '../../img/test2.png';
import DetailDialog from './DetailDialog';

const emails = ['username@gmail.com', 'user02@gmail.com'];

const minDistance = 4;

function MintCard(props) {
  const [mintMsg, setMintMsg] = React.useState('Please Mint');
  const [value2, setValue2] = React.useState<number[]>([0, 12]);
  const [openDialogTokenid, setOpenDialogTokenid] = React.useState(0);
  const [tokenids, setTokenids] = React.useState(() => {
    let tmp = [];
    const ids = [];
    for (let i = value2[0]; i < value2[1]; i++) {
      tmp.push(i);
      if (i % 4 == 3) {
        ids.push(tmp);
        tmp = [];
      }
    }
    return ids;
  });
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(emails[1]);

  const handleChange2 = (event: Event, newValue: number | number[], activeThumb: number) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (newValue[1] - newValue[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], 100 - minDistance);
        setValue2([clamped, clamped + minDistance]);
      } else {
        const clamped = Math.max(newValue[1], minDistance);
        setValue2([clamped - minDistance, clamped]);
      }
    } else {
      setValue2(newValue as number[]);
    }
    setTokenids(() => {
      let tmp = [];
      const ids = [];
      for (let i = value2[0]; i < value2[1]; i++) {
        tmp.push(i);
        if (i % 4 == 3) {
          ids.push(tmp);
          tmp = [];
        }
      }
      return ids;
    });
  };

  const handleClickOpen = tokenid => {
    setOpen(true);
    setOpenDialogTokenid(tokenid);
  };

  const handleClose = (value: string) => {
    setOpen(false);
    setSelectedValue(value);
  };

  const mint = tokenid => {
    if (tokenid % 3 == 0) {
      const nft = {
        id: tokenid,
        img: nft1_img,
        name: 'Queens Ape Hand',
        first_slot: 'I want to be a cat',
        second_slot: '',
        third_slot: '',
      };

      localStorage.setItem('NFT' + String(tokenid + 1), JSON.stringify(nft));
      setMintMsg('Successfully You Colud Mint');
    } else if (tokenid % 3 == 1) {
      const nft = {
        id: tokenid,
        img: nft2_img,
        name: 'Kings Ape Hand',
        first_slot: '',
        second_slot: '',
        third_slot: '',
      };

      localStorage.setItem('NFT' + String(tokenid + 1), JSON.stringify(nft));
      setMintMsg('Successfully You Colud Mint');
    } else {
      const nft = {
        id: tokenid,
        img: nft2_img,
        name: 'Kings Ape Hand',
        first_slot: '',
        second_slot: '',
        third_slot: '',
      };

      localStorage.setItem('NFT' + String(tokenid + 1), JSON.stringify(nft));
      setMintMsg('Successfully You Colud Mint');
    }
  };

  return (
    <div>
      <DetailDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
        img_url={nft1_img}
        tokenid={openDialogTokenid}
      />
      <Paper elevation={3}>
        <Button
          sx={{ textTransform: 'none' }}
          onClick={() => {
            handleClickOpen(props.id);
          }}
        >
          <Box
            sx={{
              justifyContent: 'space-between',
              flexDirection: 'colummn',
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            <img src={props.img_url} width='100%' />
            <Grid container alignItems='center' justifyContent='center'>
              <Grid item xs={12}>
                <Typography sx={{ mt: 5 }} variant='body1' gutterBottom>
                  {props.ownerAddress}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography sx={{ mt: 2 }} variant='body1' gutterBottom>
                  {props.id}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Button>
        <Grid container alignItems='center' justifyContent='center'>
          <Grid container alignItems='center' justifyContent='center' item xs={12}>
            <Typography sx={{ mt: 5 }} variant='h5' gutterBottom>
              PRICE : {props.buyPrice} SOL
            </Typography>
            <Typography sx={{ mt: 5 }} variant='h5' gutterBottom>
              Per Read : {props.tansuFee} SOL
            </Typography>
          </Grid>
          <Grid container alignItems='center' justifyContent='center' item xs={12}>
            <Button
              sx={{
                mt: 1,
                padding: 2,
                margin: 2,
                backgroundColor: '#ff8c00',
                '&:hover': { background: 'steelblue' },
              }}
              variant='contained'
              onClick={() => {
                mint(props.id);
              }}
              fullWidth
            >
              MINT
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

export default MintCard;
