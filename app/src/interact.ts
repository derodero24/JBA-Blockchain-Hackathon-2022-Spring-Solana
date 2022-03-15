import { Idl, Program, Provider, Wallet } from '@project-serum/anchor';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { ConfirmOptions, Connection, Keypair, PublicKey, SystemProgram } from '@solana/web3.js';

import nft1_img from '../img/test1.png';
import nft2_img from '../img/test2.png';
import nft3_img from '../img/test3.png';
import idl from './idl.json';

const baseAccount = Keypair.generate(); // アカウント
const programID = new PublicKey(idl.metadata.address); // プログラムID
console.log(programID);
const opts = { preflightCommitment: 'processed' as ConfirmOptions };

export async function testFunc(provider) {
  const program = new Program(idl as Idl, programID, provider);

  try {
    // initialize関数実行
    await program.rpc.initialize('Hello World!', {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount],
    });

    // 状態更新
    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('data', account.data);
    return account.data;
  } catch (err) {
    console.log('Transaction error:', err);
  }
}

export async function getYourNFTs() {
  const nfts = [
    { id: 0, img: nft1_img, ownerAddress: '0xgngoitnohiethpshth', tansuFee: 0.002 },
    { id: 1, img: nft2_img, ownerAddress: '0xyhtrgoitnohiethhes', tansuFee: 0.003 },
    { id: 2, img: nft3_img, ownerAddress: '0xhrtgoitnohiethpshh', tansuFee: 0.001 },
  ];

  return nfts;
}

export async function mintTansuNFT() {
  return 'ok make slide nft';
}

export async function readSlide() {
  return 'ok read';
}

export async function mintMaterial() {
  return 'ok get Material';
}

export async function getMaterialMarket() {
  const materials = [
    { id: 0, img: nft1_img, ownerAddress: '0xgngoitnohiethpshth', buyPrice: 0.2, tansuFee: 0 },
    { id: 1, img: nft2_img, ownerAddress: '0xyhtrgoitnohiethhes', buyPrice: 0, tansuFee: 0.003 },
    { id: 2, img: nft3_img, ownerAddress: '0xhrtgoitnohiethpshh', buyPrice: 0, tansuFee: 0.001 },
  ];
  return materials;
}
