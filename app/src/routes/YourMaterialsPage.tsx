import * as React from 'react';

import { Paper, Typography } from '@mui/material';

export function YourMaterialsPage() {
  const [yourNFTList, _setYourNFTList] = React.useState([]);
  React.useEffect(() => {
    getMaterials();
  });

  const getMaterials = async () => {
    // const tmp = await getYourNFTs();
    // setYourNFTList(tmp);
  };

  return (
    <div>
      {yourNFTList.map(nft => {
        return (
          <div key={nft.id}>
            <Paper>
              <img src={nft.img} width='25%' />
              <Typography variant='h5' gutterBottom component='div'>
                {nft.id}
              </Typography>
              <Typography variant='h5' gutterBottom component='div'>
                {nft.ownerAddress}
              </Typography>
              <Typography variant='h5' gutterBottom component='div'>
                {nft.tansuFee}
              </Typography>
            </Paper>
          </div>
        );
      })}
    </div>
  );
}
