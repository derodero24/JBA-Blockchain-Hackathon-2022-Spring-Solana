import { useContext } from 'react';

import { Button, Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import { readSlide } from '../interact';
import { SolanaContext } from '../solana/SolanaProvider';

export default function SlideMarketCard(props) {
  const wallet = useAnchorWallet();
  const { testFunc } = useContext(SolanaContext);

  const read = async () => {
    const _tmp = await readSlide();
  };

  const test = async () => {
    await testFunc();
  };

  if (!wallet) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
        <WalletMultiButton />
      </div>
    );
  } else {
    return (
      <div>
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
            <Typography component='div' variant='h5'>
              {props.name}
            </Typography>
            <Typography component='div' variant='h6'>
              Read Total Fee : {props.totalFee} SOL
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
                onClick={read}
                fullWidth
              >
                READ
              </Button>
            </Grid>
          </CardContent>
        </Card>
        <Button
          sx={{
            mt: 1,
            padding: 2,
            margin: 2,
            backgroundColor: '#ff8c00',
            '&:hover': { background: 'steelblue' },
          }}
          variant='contained'
          onClick={test}
          fullWidth
        >
          TEST
        </Button>
      </div>
    );
  }
}
