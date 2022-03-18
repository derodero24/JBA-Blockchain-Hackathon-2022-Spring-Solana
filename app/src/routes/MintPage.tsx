import * as React from 'react';

import Box from '@mui/material/Box';

import MintCard from '../components/MintCard';

export function MintPage() {
  const [materialMarket, _setMaterialMarket] = React.useState([]);
  React.useEffect(() => {
    getMaterialMarketTmp();
  });

  const getMaterialMarketTmp = async () => {
    // const tmp = await getMaterialMarket();
    // setMaterialMarket(tmp);
  };

  return (
    <div>
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
        {materialMarket.map(material => {
          return (
            <div key={material.id}>
              <MintCard
                id={material.id}
                ownerAddress={material.ownerAddress}
                img_url={material.img}
                buyPrice={material.buyPrice}
                tansuFee={material.tansuFee}
              />
            </div>
          );
        })}
      </Box>
    </div>
  );
}
