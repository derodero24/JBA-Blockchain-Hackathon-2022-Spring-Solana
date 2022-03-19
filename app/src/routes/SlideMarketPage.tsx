import * as React from 'react';

import { Box, Button } from '@mui/material';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import SlideMarketCard from '../components/SlideMarketCard';
import { SolanaContext } from '../solana/SolanaProvider';
import { TansuNftAccount } from '../solana/tansu_nft_types';

export function SlideMarketPage() {
  const { anchorWallet, testFunc, refreshTansuNftData } = React.useContext(SolanaContext);
  const [slideNFTs, setSlideNFTs] = React.useState<TansuNftAccount[]>([]);

  React.useEffect(() => {
    refreshTansuNftData().then(data => {
      setSlideNFTs(data.slideTansuNfts);
    });
  }, [refreshTansuNftData]);

  return (
    <>
      {anchorWallet ? (
        <Box>
          {slideNFTs.map(nft => {
            return (
              <div key={nft.metaplex.name}>
                <Box margin={5}>
                  <SlideMarketCard
                    name={nft.metaplex.name}
                    img_url={nft.metaplex.imageUri}
                    totalFee={nft.totalFee}
                    id={1}
                    shareholders={nft.shareholders}
                  />
                </Box>
              </div>
            );
          })}

          {/* <Button
            sx={{
              mt: 1,
              padding: 2,
              margin: 2,
              backgroundColor: '#ff8c00',
              '&:hover': { background: 'steelblue' },
            }}
            variant='contained'
            onClick={testFunc}
            fullWidth
          >
            TEST
          </Button> */}
        </Box>
      ) : (
        <WalletMultiButton />
      )}
    </>
  );
}
