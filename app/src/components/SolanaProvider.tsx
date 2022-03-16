import { createContext, ReactNode } from 'react';

import * as spl from '@solana/spl-token';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as web3 from '@solana/web3.js';

// import idl from '../idl.json';

export const SolanaContext = createContext({
  // airdrop: async () => {},
  mintNFT: async () => {},
  testFunc: () => {},
});

export default function SolanaProvider(props: { children: ReactNode }) {
  const { connection } = useConnection();
  const wallet = useWallet();
  // const wallet = useAnchorWallet();

  // const airdrop = async () => {
  //   const airdropSignature = await connection.requestAirdrop(
  //     wallet.publicKey,
  //     web3.LAMPORTS_PER_SOL
  //   );
  //   await connection.confirmTransaction(airdropSignature);
  // };

  const mintNFT = async () => {
    if (!wallet.publicKey) {
      console.log('Please connect a wallet before.');
      return;
    }

    // Generate/Get keys
    const mint = web3.Keypair.generate();
    const associatedTokenAccount = await spl.getAssociatedTokenAddress(
      mint.publicKey,
      wallet.publicKey
    );

    // Transaction for creating NFT
    const transaction = new web3.Transaction().add(
      // create mint account
      web3.SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: mint.publicKey,
        space: spl.MINT_SIZE,
        lamports: await spl.getMinimumBalanceForRentExemptMint(connection),
        programId: spl.TOKEN_PROGRAM_ID,
      }),
      // init mint account
      spl.createInitializeMintInstruction(
        mint.publicKey, // mint pubkey
        0, // decimals
        wallet.publicKey, // mint authority
        wallet.publicKey // freeze authority
      ),
      // create associated-token-account
      spl.createAssociatedTokenAccountInstruction(
        wallet.publicKey, // payer
        associatedTokenAccount, // ata
        wallet.publicKey, // owner
        mint.publicKey // mint
      ),
      // mint to
      spl.createMintToInstruction(
        mint.publicKey, // mint
        associatedTokenAccount, // receiver
        wallet.publicKey, // mint authority
        1 // amount
      ),
      // disable additional mint
      spl.createSetAuthorityInstruction(
        mint.publicKey, // mint
        wallet.publicKey, // Current authority
        spl.AuthorityType.MintTokens, // Type of authority
        null // New authority
      )
    );

    // Transaction実行
    const signature = await wallet.sendTransaction(transaction, connection, { signers: [mint] });
    await connection.confirmTransaction(signature, 'processed');
  };

  const testFunc = () => {};

  return (
    <SolanaContext.Provider
      value={{
        mintNFT,
        testFunc,
      }}
    >
      {props.children}
    </SolanaContext.Provider>
  );
}
