import { createContext, ReactNode, useState } from 'react';

import * as anchor from '@project-serum/anchor';
import * as spl from '@solana/spl-token';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as web3 from '@solana/web3.js';

import idl from '../solana/idl.json';
import { TansuNft } from './tansu_nft';

export const SolanaContext = createContext({
  createTansuNft: async (_a: web3.PublicKey[], _b: number) => true,
  refreshTansuNftData: async () => {},
  testFunc: () => {},
  ownTansuNfts: [] as web3.PublicKey[],
  othersTansuNfts: [] as web3.PublicKey[],
});

export default function SolanaProvider(props: { children: ReactNode }) {
  const { connection } = useConnection();
  const wallet = useWallet();
  const program = new anchor.Program(
    idl as anchor.Idl,
    new web3.PublicKey(idl.metadata.address),
    new anchor.Provider(connection, wallet, {
      preflightCommitment: 'processed',
      commitment: 'processed',
    })
  ) as anchor.Program<TansuNft>;

  // Tansu NFT一覧
  const [ownTansuNfts, setOwnTansuNfts] = useState<web3.PublicKey[]>([]);
  const [othersTansuNfts, setOthersTansuNfts] = useState<web3.PublicKey[]>([]);

  const generatePubkeyFromBs58 = (base58Pubkey: string): web3.PublicKey => {
    // base58形式文字列からPublickeyインスタンスを作成
    const pubkeyBuffer = anchor.utils.bytes.bs58.decode(base58Pubkey);
    const generatedPubkey = new web3.PublicKey(pubkeyBuffer);
    return generatedPubkey;
  };

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

  const getNftOwner = (mintPubkey: web3.PublicKey): Promise<web3.PublicKey> => {
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
        const Base58OwnerPubkey = data.parsed.info.owner as string;
        return generatePubkeyFromBs58(Base58OwnerPubkey);
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

  const fetchTansuAccount = (tansuPubkey: web3.PublicKey) => {
    // 特定のTansuアカウントを取得
    return program.account.tansu.fetch(tansuPubkey);
  };

  const fetchAllTansuAccounts = (mintPubkey?: web3.PublicKey) => {
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
        return initializeTansuAccount(mintPubkey, innerTokenPubkeys, originalsReedFee);
      })
      .then(tansuPubkey => {
        console.log('initializeTansuAccount(): ✓');
        return fetchTansuAccount(tansuPubkey);
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

  const refreshTansuNftData = async () => {
    // Tansu NFTリストをリフレッシュ

    // 全Tansuアカウント一覧
    const allTansuAccountsPromise = fetchAllTansuAccounts();

    // 所有するNFT一覧
    const ownNftBase58PubkeysPromise = connection
      .getParsedTokenAccountsByOwner(wallet.publicKey, {
        programId: spl.TOKEN_PROGRAM_ID,
      })
      .then(res => {
        const ownNftBase58Pubkeys: string[] = [];
        for (const tokenData of res.value) {
          const info = tokenData.account.data.parsed.info;
          if (info.tokenAmount.amount === '1' && info.tokenAmount.decimals === 0) {
            ownNftBase58Pubkeys.push(info.mint);
          }
        }
        return ownNftBase58Pubkeys;
      });

    // 両方のPromiseが完了した後の処理
    await Promise.all([allTansuAccountsPromise, ownNftBase58PubkeysPromise]).then(
      ([allTansuAccounts, ownNftBase58Pubkeys]) => {
        const newOwnTansuNfts: web3.PublicKey[] = [];
        const newOthersTansuNfts: web3.PublicKey[] = [];

        // Tansu NFTの振り分け
        for (const tansu of allTansuAccounts) {
          const tansuOriginalTokenPubkey = tansu.account.originalToken;
          if (ownNftBase58Pubkeys.includes(tansuOriginalTokenPubkey.toBase58())) {
            // 自分の所有するTansu NFTの場合
            newOwnTansuNfts.push(tansuOriginalTokenPubkey);
          } else {
            // 他人の所有するTansu NFTの場合
            newOthersTansuNfts.push(tansuOriginalTokenPubkey);
          }
        }

        // State更新
        console.log('Number of own Tansu NFT:', newOwnTansuNfts.length);
        console.log('Number of others Tansu NFT:', newOthersTansuNfts.length);
        setOwnTansuNfts(newOwnTansuNfts);
        setOwnTansuNfts(newOthersTansuNfts);
      }
    );
  };

  const testFunc = async () => {
    await refreshTansuNftData();
    // createTansuNft([], 100);
    // createTansuNftsForTest();
  };

  return (
    <SolanaContext.Provider
      value={{
        createTansuNft,
        refreshTansuNftData,
        testFunc,
        ownTansuNfts,
        othersTansuNfts,
      }}
    >
      {props.children}
    </SolanaContext.Provider>
  );
}
