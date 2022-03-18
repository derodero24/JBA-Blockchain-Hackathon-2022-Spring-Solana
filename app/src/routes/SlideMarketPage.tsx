import * as React from 'react';

import { Box, Grid } from '@mui/material';
import * as web3 from '@solana/web3.js';

import SlideMarketCard from '../components/SlideMarketCard';
import { TansuNftAccount } from '../solana/tansu_nft_types';

const dummyAdd = web3.Keypair.generate();

const slideFetchData1: TansuNftAccount = {
  totalFee: 1.2,
  owner: dummyAdd.publicKey,
  publicKey: dummyAdd.publicKey,
  tansu: { originalToken: dummyAdd.publicKey, innerTokens: [dummyAdd.publicKey], useFee: 0.2 },
  metaplex: {
    name: 'dummy',
    imageUri: 'https://ipfs.io/ipfs/QmeAP2RBjug2aVLHhk99nKJDxa7RPyBFG4mf59VmUoyZ5h',
  },
  shareholders: [{ publicKey: dummyAdd.publicKey, fee: 0.2 }],
};

export function SlideMarketPage() {
  const [slideNFTs, _setSlideNFTs] = React.useState<TansuNftAccount[]>([
    slideFetchData1,
    slideFetchData1,
    slideFetchData1,
  ]);

  return (
    <div>
      <Grid container alignItems='center' justifyContent='center'>
        <Box></Box>
      </Grid>
      {slideNFTs.map(nft => {
        return (
          <div key={nft.metaplex.name}>
            <Box margin={5}>
              <SlideMarketCard
                name={nft.metaplex.name}
                img_url={nft.metaplex.imageUri}
                totalFee={nft.totalFee}
                id={1}
              />
            </Box>
          </div>
        );
      })}
    </div>
  );
}
