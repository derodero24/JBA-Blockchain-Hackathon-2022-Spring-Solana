import '@solana/wallet-adapter-react-ui/styles.css';

import { ReactNode, SyntheticEvent, useState } from 'react';

import { AppBar, Box, Tab, Tabs, Typography } from '@mui/material';

import { MaterialMarketPage, PresentationPage, SlideMarketPage, YourSlidePage } from './routes';

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function App() {
  const [value, setValue] = useState(1);

  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <AppBar sx={{ backgroundColor: '#f8f8ff' }} position='static'>
        <Box sx={{ borderBottom: 1, color: 'whitesmoke' }}>
          <Tabs
            sx={{ indicatorColor: 'whitesmoke' }}
            centered
            value={value}
            variant='fullWidth'
            onChange={handleChange}
            aria-label='basic tabs example'
          >
            <Tab label='Slide' {...a11yProps(0)} />
            <Tab label='Material Market' {...a11yProps(1)} />
            <Tab label='Your Slide' {...a11yProps(2)} />
            <Tab label='Slide Market' {...a11yProps(3)} />
          </Tabs>
        </Box>
      </AppBar>
      <TabPanel value={value} index={0}>
        <PresentationPage />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <MaterialMarketPage />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <YourSlidePage />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <SlideMarketPage />
      </TabPanel>
    </Box>
  );
}
