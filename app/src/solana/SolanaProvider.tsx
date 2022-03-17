import { createContext, ReactNode, useRef } from 'react';

import * as anchor from '@project-serum/anchor';
import * as spl from '@solana/spl-token';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as web3 from '@solana/web3.js';

import idl from '../solana/idl.json';
import { TansuNft } from './tansu_nft';

const programID = new web3.PublicKey(idl.metadata.address);

export const SolanaContext = createContext({
  createTansuNft: async (_a: web3.PublicKey[], _b: number) => true,
  fetchTansu: async (_: web3.PublicKey) => _ as any,
  fetchAllTansus: async (_?: web3.PublicKey) => [],
  testFunc: () => {},
});

export default function SolanaProvider(props: { children: ReactNode }) {
  const { connection } = useConnection();
  const wallet = useWallet();
  const provider = new anchor.Provider(connection, wallet, {
    preflightCommitment: 'processed',
    commitment: 'processed',
  });
  const program = new anchor.Program(
    idl as anchor.Idl,
    programID,
    provider
  ) as anchor.Program<TansuNft>;

  const mintPubkeys = useRef<web3.PublicKey[]>([]);

  const mintNft = async (): Promise<web3.PublicKey> => {
    if (!wallet.publicKey) {
      console.log('Please connect a wallet before.');
      return;
    }

    // Generate/Get keys
    const mint = web3.Keypair.generate();
    const associatedTokenAddress = await spl.getAssociatedTokenAddress(
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
        associatedTokenAddress, // associated-token-account
        wallet.publicKey, // owner
        mint.publicKey // mint
      ),
      // mint to
      spl.createMintToInstruction(
        mint.publicKey, // mint
        associatedTokenAddress, // receiver
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
    console.log('sending a transaction...');
    const signature = await wallet.sendTransaction(transaction, connection, {
      signers: [mint],
    });
    await connection.confirmTransaction(signature, 'processed');
    console.log('successfully mint NFT');

    return mint.publicKey;
  };

  const getNftOwner = (mintPubkey: web3.PublicKey): Promise<string> => {
    // mintアドレスから所有者アドレスを特定
    return connection
      .getTokenLargestAccounts(mintPubkey)
      .then(res => {
        console.log('getTokenLargestAccounts() >', res);
        const tokenAccount = res.value[0].address;
        return connection.getParsedAccountInfo(tokenAccount);
      })
      .then(res => {
        console.log('getParsedAccountInfo() >', res);
        const data = res.value.data as web3.ParsedAccountData;
        const Base58OwnerAddress = data.parsed.info.owner as string;
        console.log('Base58OwnerAddress:', Base58OwnerAddress);
        return Base58OwnerAddress;
      });
  };

  const initializeTansuAccount = (
    mintPubkey: web3.PublicKey,
    innerTokenPubkeys: web3.PublicKey[],
    originalsReedFee
  ): Promise<web3.PublicKey> => {
    // Tansuアカウントの初期化
    const tansu = web3.Keypair.generate();
    return program.rpc
      .initialize(mintPubkey, innerTokenPubkeys, originalsReedFee, {
        accounts: {
          tansu: tansu.publicKey,
          payer: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        },
        signers: [tansu],
      })
      .then(() => tansu.publicKey);
  };

  const fetchTansu = (tansuPubkey: web3.PublicKey) => {
    // 特定のTansuアカウントを取得
    return program.account.tansu.fetch(tansuPubkey);
  };

  const fetchAllTansus = (mintPubkey?: web3.PublicKey) => {
    // すべてのTansuアカウントを取得
    // mintアドレスでフィルタリングも可能
    if (mintPubkey) {
      return program.account.tansu.all([
        {
          memcmp: {
            offset: 8, // Discriminator.
            bytes: mintPubkey.toBase58(),
          },
        },
      ]);
    } else {
      return program.account.tansu.all();
    }
  };

  const createTansuNft = (
    innerTokenPubkeys: web3.PublicKey[],
    originalsReedFee: number
  ): Promise<boolean> => {
    // Tansu NFTの作成
    return mintNft()
      .then(mintPubkey => {
        console.log('mintNFT(): ✓');
        mintPubkeys.current.push(mintPubkey);
        return initializeTansuAccount(mintPubkey, innerTokenPubkeys, originalsReedFee);
      })
      .then(tansuPubkey => {
        console.log('initializeTansuAccount(): ✓');
        return fetchTansu(tansuPubkey);
      })
      .then(tansuAccount => {
        console.log('fetchTansu(): ✓');
        console.log('tansuAccount:', tansuAccount);
        return true;
      })
      .catch(e => {
        console.log('Error:', e);
        return false;
      });
  };

  const testFunc = () => {
    createTansuNft([], 100);
    // const keypair = web3.Keypair.generate();
    // const base58key = keypair.publicKey.toBase58();
    // console.log(keypair.publicKey);
    // console.log(base58key);
    // const bytes = bs58.decode(base58key);
    // console.log(JSON.stringify(Array.from(bytes)));
    // // const newPubkey = web3.PublicKey.decode(Buffer.from(base58key));
    // const newPubkey = web3.PublicKey.decode(Buffer.from(bytes));
    // console.log(newPubkey);
    // console.log(newPubkey.toBase58());
  };

  return (
    <SolanaContext.Provider
      value={{
        createTansuNft,
        fetchTansu,
        fetchAllTansus,
        testFunc,
      }}
    >
      {props.children}
    </SolanaContext.Provider>
  );
}
