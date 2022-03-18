import * as React from 'react';

import { Box, Grid, Paper, Typography } from '@mui/material';

function Slide(props) {
  const [colors, _setColors] = React.useState([
    Math.random().toString(16).slice(-6),
    Math.random().toString(16).slice(-6),
  ]);

  return (
    <div>
      <Box sx={{ ml: 10, mr: 10 }}>
        <Paper>
          <Box sx={{ mt: 10, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ mt: 2 }}>
              <Grid container>
                <Grid item xs={12} container alignItems='center' justifyContent='center'>
                  <Box mt={2}>
                    <Typography variant='h3' gutterBottom component='div'>
                      {props.title}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Grid container>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      mt: 3,
                      ml: 20,
                      mb: 10,
                      width: 400,
                      height: 400,
                      boxShadow: 1,
                      background: `linear-gradient(to top, #${colors[0]} 0%, #${colors[1]} 100%)`,
                    }}
                  >
                    <img src={props.img_url} height='100%' />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      margin: 10,
                      mt: 20,
                      justifyContent: 'center',
                      textAlign: 'center',
                      width: 500,
                      height: 300,
                    }}
                  >
                    <Typography variant='h3' color='text.secondary' component='div'>
                      {props.msg}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>
      </Box>
    </div>
  );
}

export default Slide;
