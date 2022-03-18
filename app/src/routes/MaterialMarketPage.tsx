import '@solana/wallet-adapter-react-ui/styles.css';

import { useContext, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import MintCard from '../components/MintCard';
import { SolanaContext } from '../solana/SolanaProvider';
import { TansuNftAccount } from '../solana/tansu_nft_types';

export function MaterialMarketPage() {
  const wallet = useAnchorWallet();
  const { refreshTansuNftData } = useContext(SolanaContext);
  const [dummys, setDummys] = useState<TansuNftAccount[]>([]);

  useEffect(() => {
    refreshTansuNftData().then(data => {
      setDummys(data.materialTansuNfts);
    });
  }, [refreshTansuNftData]);

  return (
    <>
      {wallet ? (
        <Box
          sx={{
            flexDirection: 'row',
            display: 'flex',
          }}
        >
          {dummys.map(material => {
            return (
              <div key={material.metaplex.name}>
                <MintCard
                  name={material.metaplex.name}
                  ownerAddress={material.owner.toBase58()}
                  img_url={material.metaplex.imageUri}
                  useFee={material.tansu.useFee}
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
