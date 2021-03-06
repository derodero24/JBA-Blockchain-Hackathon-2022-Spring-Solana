import * as web3 from '@solana/web3.js';

export type TansuMeta = {
  originalToken: web3.PublicKey;
  innerTokens: web3.PublicKey[];
  useFee: number;
};

export type MetaplexMeta = {
  name: string;
  imageUri: string;
};

export type Shareholder = {
  publicKey: web3.PublicKey;
  fee: number;
};

export type TansuNftAccount = {
  owner: web3.PublicKey;
  publicKey: web3.PublicKey;
  totalFee: number;
  tansu: TansuMeta;
  metaplex: MetaplexMeta;
  shareholders: Shareholder[];
};
