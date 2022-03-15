import * as React from 'react';

import { Box, Grid, Paper, Typography } from '@mui/material';

function Slide(props) {
  const [demandDesire, setDemandDesire] = React.useState('');
  const [submitDesireFlag, setSubmitDesireFlag] = React.useState(1);
  const [colors, setColors] = React.useState([
    Math.random().toString(16).slice(-6),
    Math.random().toString(16).slice(-6),
  ]);

  const generateDesire = id => {
    if (id == 0) {
      const NFT1 = JSON.parse(localStorage.getItem('NFT1'));
      if (NFT1.first_slot.length == 0) {
        localStorage.setItem(
          'NFT1',
          JSON.stringify({
            id: NFT1.id,
            img: NFT1.img,
            name: NFT1.name,
            first_slot: demandDesire,
            second_slot: NFT1.second_slot,
            third_slot: NFT1.third_slot,
          })
        );
      } else if (NFT1.second_slot.length == 0) {
        localStorage.setItem(
          'NFT1',
          JSON.stringify({
            id: NFT1.id,
            img: NFT1.img,
            name: NFT1.name,
            first_slot: NFT1.first_slot,
            second_slot: demandDesire,
            third_slot: NFT1.third_slot,
          })
        );
      } else if (NFT1.third_slot.length == 0) {
        localStorage.setItem(
          'NFT1',
          JSON.stringify({
            id: NFT1.id,
            img: NFT1.img,
            name: NFT1.name,
            first_slot: NFT1.first_slot,
            second_slot: NFT1.second_slot,
            third_slot: demandDesire,
          })
        );
      } else {
        console.log('full slot already');
      }
    } else if (id == 1) {
      const NFT2 = JSON.parse(localStorage.getItem('NFT2'));
      if (NFT2.first_slot.length == 0) {
        localStorage.setItem(
          'NFT2',
          JSON.stringify({
            id: NFT2.id,
            img: NFT2.img,
            name: NFT2.name,
            first_slot: demandDesire,
            second_slot: NFT2.second_slot,
            third_slot: NFT2.third_slot,
          })
        );
      } else if (NFT2.second_slot.length == 0) {
        localStorage.setItem(
          'NFT2',
          JSON.stringify({
            id: NFT2.id,
            img: NFT2.img,
            name: NFT2.name,
            first_slot: NFT2.first_slot,
            second_slot: demandDesire,
            third_slot: NFT2.third_slot,
          })
        );
      } else if (NFT2.third_slot.length == 0) {
        localStorage.setItem(
          'NFT2',
          JSON.stringify({
            id: NFT2.id,
            img: NFT2.img,
            name: NFT2.name,
            first_slot: NFT2.first_slot,
            second_slot: NFT2.second_slot,
            third_slot: demandDesire,
          })
        );
      } else {
        console.log('full slot already');
      }
    }

    //setYourNFTs([JSON.parse(localStorage.getItem("NFT1")), JSON.parse(localStorage.getItem("NFT2"))]);
  };

  const handleChangeDesireForm = e => {
    setDemandDesire(e.target.value);
  };

  const makeDesire = () => {
    setSubmitDesireFlag(submitDesireFlag * -1);
  };

  return (
    <div>
      <Box sx={{ ml: 10, mr: 10 }}>
        <Paper>
          <Box sx={{ mt: 10, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ mt: 2 }}>
              <Grid container>
                <Grid item xs={12} container alignItems='center' justifyContent='center'>
                  <Box mt={2}>
                    <Typography variant='h3' gutterBottom component='div'>
                      {props.title}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Grid container>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      mt: 3,
                      ml: 10,
                      mb: 10,
                      width: 400,
                      height: 400,
                      boxShadow: 1,
                      background: `linear-gradient(to top, #${colors[0]} 0%, #${colors[1]} 100%)`,
                    }}
                  >
                    <img src={props.img_url} height='100%' />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      margin: 10,
                      justifyContent: 'center',
                      textAlign: 'center',
                      width: 400,
                      height: 300,
                    }}
                  >
                    <Typography variant='h4' color='text.secondary' component='div'>
                      {props.msg}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>
      </Box>
    </div>
  );
}

export default Slide;
