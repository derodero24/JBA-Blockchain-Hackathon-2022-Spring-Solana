import { createContext, ReactNode, useState } from 'react';

// import { Idl, Program, Provider, Wallet } from '@project-serum/anchor';
import {
  AuthorityType,
  createMint,
  createMintToInstruction,
  createSetAuthorityInstruction,
  getMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  mintToInstructionData,
} from '@solana/spl-token';
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  clusterApiUrl,
  ConfirmOptions,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  Signer,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';

import idl from '../idl.json';

// 固定値
const PAYER = Keypair.generate();
// const MINT_AUTHORITY = Keypair.generate();
// const FREEZE_AUTHORITY = Keypair.generate();

export const SolanaContext = createContext({
  airdrop: async () => {},
  createSplToken: async () => {},
  testFunc: () => {},
});

export default function SolanaProvider(props: { children: ReactNode }) {
  const { connection } = useConnection();
  const wallet = useWallet();
  // const wallet = useAnchorWallet();

  const airdrop = async () => {
    // const airdropSignature = await connection.requestAirdrop(wallet.publicKey, LAMPORTS_PER_SOL);
    // await connection.confirmTransaction(airdropSignature);
    const airdropSignature = await connection.requestAirdrop(PAYER.publicKey, LAMPORTS_PER_SOL);
    await connection.confirmTransaction(airdropSignature);
  };

  const createSplToken = async () => {
    const mint = await createMint(connection, PAYER, PAYER.publicKey, PAYER.publicKey, 0);
    console.log(mint.toBase58());
    console.log('1');

    // Mint情報チェック
    const mintInfo = await getMint(connection, mint);
    console.log(mintInfo);

    // トークン保有用アカウント
    const associatedTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      PAYER,
      mint,
      wallet.publicKey
    );
    console.log('2');

    // ミント
    await mintTo(connection, PAYER, mint, associatedTokenAccount.address, PAYER, 1);
    console.log('3');

    // ミント禁止
    const transaction = new Transaction().add(
      createSetAuthorityInstruction(mint, PAYER.publicKey, AuthorityType.MintTokens, null)
    );
    await sendAndConfirmTransaction(connection, transaction, [PAYER]);
    console.log('4');
  };

  const testFunc = async () => {
    await airdrop();
    await createSplToken();
  };

  return (
    <SolanaContext.Provider
      value={{
        airdrop,
        createSplToken,
        testFunc,
      }}
    >
      {props.children}
    </SolanaContext.Provider>
  );
}
