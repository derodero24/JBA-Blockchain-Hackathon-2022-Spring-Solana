import { Card, CardContent, CardMedia, Typography } from '@mui/material';

function MintCard(props) {
  return (
    <div>
      <Card sx={{ maxWidth: '75%', alignContents: 'center', justifyContents: 'center' }}>
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
          <Typography component='div' variant='h5'>
            use fee : {props.useFee} SOL
          </Typography>
          <Typography component='div' variant='body1'>
            Owner : {props.ownerAddress}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default MintCard;
