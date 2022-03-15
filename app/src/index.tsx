import React from 'react';
import ReactDOM from 'react-dom';

import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

import App from './App';
import SolanaProvider from './components/SolanaProvider';

// const network = 'http://127.0.0.1:8899'; // localhost
const network = clusterApiUrl('devnet'); // devnet/testnet/mainnet-beta
const wallets = [new PhantomWalletAdapter()]; // 対応ウォレット

ReactDOM.render(
  <React.StrictMode>
    <ConnectionProvider endpoint={network}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <SolanaProvider>
            <App />
          </SolanaProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
