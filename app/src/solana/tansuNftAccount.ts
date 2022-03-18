import * as web3 from '@solana/web3.js';

export type TansuNftAccount = {
  publicKey: web3.PublicKey;
  tansu: {
    originalToken: web3.PublicKey;
    innerTokens: web3.PublicKey[];
    originalsReadFee: number;
  };
};

export const defaultTansuNftAccount: TansuNftAccount = {
  publicKey: null,
  tansu: {
    originalToken: null,
    innerTokens: null,
    originalsReadFee: null,
  },
};
