import { Button, Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import { Provider, Wallet } from '@project-serum/anchor';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { ConfirmOptions, Connection } from '@solana/web3.js';

import { readSlide, testFunc } from '../interact';

const opts = { preflightCommitment: 'processed' as ConfirmOptions };

export default function SlideMarketCand(props) {
  const wallet = useAnchorWallet();

  const getProvider = async () => {
    // プロバイダーを準備
    const connection = new Connection(props.network, opts.preflightCommitment);
    const provider = new Provider(connection, wallet as Wallet, opts.preflightCommitment);
    return provider;
  };

  const read = async () => {
    const _tmp = await readSlide();
  };

  const test = async () => {
    const provider = await getProvider();
    const _data = await testFunc(provider);
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
                onClick={() => {
                  read();
                }}
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
          onClick={() => {
            test();
          }}
          fullWidth
        >
          TEST
        </Button>
      </div>
    );
  }
}
