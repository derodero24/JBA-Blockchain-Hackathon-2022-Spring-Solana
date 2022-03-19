import { useContext } from 'react';

import { Button, Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';

import { SolanaContext } from '../solana/SolanaProvider';

export default function YourSlideCard(props) {
  const { createTansuNft, generatePubkeyFromBs58 } = useContext(SolanaContext);
  const metadataUri = 'https://ipfs.io/ipfs/Qmd683M7U7chTFkESuaZwBDGyLAsgxxGtRATfJstetmdnn';

  return (
    <Card sx={{ maxWidth: '25%', alignContents: 'center', justifyContents: 'center' }}>
      <CardMedia
        component='img'
        sx={{
          alignContents: 'center',
          justifyContents: 'center',
          margin: 5,
          width: '75%',
          height: '75%',
          boxShadow: 1,
          background: 'linear-gradient(to top, #33ccff 0%, #ff66ff 100%)',
        }}
        image={props.img_url}
      />
      <CardContent sx={{ flex: 'auto' }}>
        <Typography component='div' variant='h4'>
          {props.name}
        </Typography>
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
            onClick={() =>
              createTansuNft(
                [
                  generatePubkeyFromBs58('27MNCxmGVZ1xhidZ2WwNoaJRUZ2TMXiAybYAjrwZbtWo'),
                  generatePubkeyFromBs58('6cYG5PVCYuVWLoxgX1Gp5dukP48RoHHPAvr3sB851EQ2'),
                  generatePubkeyFromBs58('CZHnYBAFyRubiktfR8XbLx91o3CpuDNetSXU1F9NfRxy'),
                ],
                3,
                metadataUri
              )
            }
            fullWidth
          >
            MINT
          </Button>
        </Grid>
      </CardContent>
    </Card>
  );
}
