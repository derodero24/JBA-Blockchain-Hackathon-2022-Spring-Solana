import Button from "@mui/material/Button";
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { makeStyles, useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import '@solana/wallet-adapter-react-ui/styles.css';

import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

import Grid from '@mui/material/Grid';

import YourMaterials from "./your_materials";
import Presentation from "./presentation";
import MintPage from "./mint_page";
import SlideMarket from "./slide_market";
import YourSlidePage from "./your_slide_page";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
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

function BasicTabs() {
  const [value, setValue] = React.useState(0);
  const network = 'http://127.0.0.1:8899'; // localhost
  // const network = clusterApiUrl('devnet'); // devnet/testnet/mainnet-beta
  console.log(network);
  const wallets = [new PhantomWalletAdapter()]; // 対応ウォレット
  
  
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <ConnectionProvider endpoint={network}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Box sx={{ width: '100%' }}>
            <AppBar sx={{backgroundColor: "#f8f8ff"}} position="static">
            <Box sx={{borderBottom: 1, color:"whitesmoke"}}>
              <Tabs sx={{indicatorColor:"whitesmoke"}} centered value={value} variant="fullWidth" onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Slide" {...a11yProps(0)} />
                <Tab label="Your Materials" {...a11yProps(1)} />
                <Tab label="Material Market" {...a11yProps(2)} />
                <Tab label="Your Slide" {...a11yProps(3)} />
                <Tab label="Slide Market" {...a11yProps(4)} />
              </Tabs>
            </Box>
            </AppBar>
            <TabPanel value={value} index={0}>
              <Presentation/>
            </TabPanel>
            <TabPanel value={value} index={1}>
            <YourMaterials/>
            </TabPanel>
            <TabPanel value={value} index={2}>
              <MintPage/>
            </TabPanel>
            <TabPanel value={value} index={3}>
              <YourSlidePage/>
            </TabPanel>
            <TabPanel value={value} index={4}>
              <SlideMarket network={network}/>
            </TabPanel>
          </Box>
    </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}



export default BasicTabs;