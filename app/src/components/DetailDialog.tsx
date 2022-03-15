import { Box, Dialog, Typography, useMediaQuery, useTheme } from '@mui/material';

export interface SimpleDialogProps {
  tokenid: number;
  img_url: string;
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

function DetailDialog(props: SimpleDialogProps) {
  const { onClose, selectedValue, open, img_url, tokenid } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('lg'));

  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <Dialog
      sx={{ textAlign: 'center' }}
      onClose={handleClose}
      open={open}
      fullScreen={fullScreen}
      fullWidth
      maxWidth={'lg'}
    >
      <Box
        sx={{
          justifyContent: 'space-between',
          textAlign: 'center',
          flexDirection: 'row',
          display: 'flex',
          '& > :not(style)': {
            m: 3,
            height: 480,
          },
        }}
      >
        <img src={img_url} height='100%' />
        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={{ mt: 20, textAlign: 'center' }} variant='h2' gutterBottom>
            Queen of Kaguya : MiiRa #{tokenid}
          </Typography>
        </Box>
      </Box>
    </Dialog>
  );
}

export default DetailDialog;
