import '@solana/wallet-adapter-react-ui/styles.css';

import { useContext } from 'react';

import Box from '@mui/material/Box';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import MintCard from '../components/MintCard';
import { SolanaContext } from '../solana/SolanaProvider';

export function MaterialMarketPage() {
  const { wallet, materialTansuNfts } = useContext(SolanaContext);

  return (
    <>
      {wallet ? (
        <Box
          sx={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            display: 'flex',
            '& > :not(style)': {
              m: 6,
              width: 280,
              height: 600,
            },
          }}
        >
          {materialTansuNfts.map(material => {
            return (
              <div key={material.publicKey.toBase58()}>
                <MintCard
                  id={material.publicKey.toBase58()}
                  ownerAddress={material.owner.toBase58()}
                  img_url={material.metaplex.imageUri}
                  buyPrice={material.tansu.originalToken}
                  tansuFee={material.tansu.originalToken}
                />
              </div>
            );
          })}
        </Box>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
          <WalletMultiButton />
        </div>
      )}
    </>
  );
}
