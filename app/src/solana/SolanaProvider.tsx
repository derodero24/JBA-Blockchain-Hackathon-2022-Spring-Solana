import axios, { AxiosResponse } from 'axios';
import { createContext, ReactNode, useState } from 'react';

import * as mpl from '@metaplex/js';
import * as anchor from '@project-serum/anchor';
import * as spl from '@solana/spl-token';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as web3 from '@solana/web3.js';

import idl from './idl.json';
import { TansuNft } from './tansu_nft';
import { defaultTansuNftAccount, TansuNftAccount } from './tansuNftAccount';

export const SolanaContext = createContext({
  createTansuNft: async (_a: web3.PublicKey[], _b: number) => null,
  refreshTansuNftData: async () => {},
  testFunc: () => {},
  ownTansuNfts: [] as TansuNftAccount[],
  othersTansuNfts: [] as TansuNftAccount[],
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
  const [ownTansuNfts, setOwnTansuNfts] = useState<TansuNftAccount[]>([]);
  const [othersTansuNfts, setOthersTansuNfts] = useState<TansuNftAccount[]>([]);

  const lookup = async (url: string): Promise<mpl.MetadataJson> => {
    // et metadata json
    try {
      const { data } = await axios.get<string, AxiosResponse<mpl.MetadataJson>>(url);
      return data;
    } catch {
      throw new Error(`unable to get metadata json from url ${url}`);
    }
  };

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
      )
      // disable additional mint
      // TODO: Metaplexメタデータアップロード後に実施
      // spl.createSetAuthorityInstruction(
      //   mint.publicKey, // mint
      //   wallet.publicKey, // Current authority
      //   spl.AuthorityType.MintTokens, // Type of authority
      //   null // New authority
      // )
    );

    // Transaction実行
    console.log('sending a transaction...');
    const signature = await wallet.sendTransaction(transaction, connection, {
      signers: [mint],
    });
    await connection.confirmTransaction(signature, 'processed');
    console.log('successfully mint NFT');

    // --------create metadata-----------
    const uri = 'https://gateway.pinata.cloud/ipfs/QmNQh8noRHn7e7zt9oYNfGWuxHgKWkNPducMZs1SiZaYw4';

    const {
      name,
      symbol,
      seller_fee_basis_points,
      properties: { creators },
    } = await lookup(uri);

    const metadataDataProps = new mpl.programs.metadata.MetadataDataData({
      name,
      symbol,
      uri,
      sellerFeeBasisPoints: seller_fee_basis_points,
      creators: null,
    });

    const { txId, metadata } = await createMetadataNFT(
      mint.publicKey,
      metadataDataProps,
      wallet.publicKey
    );

    return mint.publicKey;
  };

  const fetchTokenMetadata = async (mintPubkey: web3.PublicKey) => {
    const pda = await mpl.programs.metadata.Metadata.getPDA(mintPubkey);
    const onchainData = (await mpl.programs.metadata.Metadata.load(connection, pda)).data;
    const offchainData = (await axios.get(onchainData.data.uri)).data;
    console.log('onchain data:', onchainData);
    console.log('offchain data:', offchainData);
    return { onchainData, offchainData };
  };

  const createMetadataNFT = async (
    editionMint: web3.PublicKey,
    metadataData: any,
    updateAuthority: web3.PublicKey
  ) => {
    const txId = await mpl.actions.createMetadata({
      connection,
      wallet,
      editionMint,
      metadataData,
      updateAuthority,
    });
    const metadata = await mpl.programs.metadata.Metadata.getPDA(editionMint);
    console.log('Created Metadata:', txId, metadata.toBase58());
    return { txId, metadata };
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
      })
      .catch(e => {
        console.log('Error:', e);
        return null;
      });
  };

  const initializeTansuAccount = (
    mintPubkey: web3.PublicKey,
    innerTokenPubkeys: web3.PublicKey[],
    originalsReedFee: number
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
    useFee: number
  ): Promise<TansuNftAccount | null> => {
    // Tansu NFTの作成
    const tansuNftAccount = defaultTansuNftAccount;

    return mintNft()
      .then(mintPubkey => {
        console.log('mintNFT(): ✓');
        tansuNftAccount.tansu = {
          originalToken: mintPubkey,
          innerTokens: innerTokenPubkeys,
          useFee: useFee,
        };
        return initializeTansuAccount(mintPubkey, innerTokenPubkeys, useFee);
      })
      .then(tansuPubkey => {
        console.log('initializeTansuAccount(): ✓');
        tansuNftAccount.publicKey = tansuPubkey;
        setOwnTansuNfts(prev => [...prev, tansuNftAccount]);
        return tansuNftAccount;
      })
      .catch(e => {
        console.log('Error:', e);
        return null;
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
        const newOwnTansuNfts: TansuNftAccount[] = [];
        const newOthersTansuNfts: TansuNftAccount[] = [];

        // Tansu NFTの振り分け
        for (const tansu of allTansuAccounts) {
          const tansuNftAccount: TansuNftAccount = {
            publicKey: tansu.publicKey,
            tansu: {
              originalToken: tansu.account.originalToken,
              innerTokens: tansu.account.innerTokens,
              useFee: tansu.account.useFee,
            },
          };
          if (ownNftBase58Pubkeys.includes(tansu.account.originalToken.toBase58())) {
            // 自分の所有するTansu NFTの場合
            newOwnTansuNfts.push(tansuNftAccount);
          } else {
            // 他人の所有するTansu NFTの場合
            newOthersTansuNfts.push(tansuNftAccount);
          }
        }

        // State更新
        console.log('Number of own Tansu NFT:', newOwnTansuNfts.length);
        console.log('Number of others Tansu NFT:', newOthersTansuNfts.length);
        setOwnTansuNfts(newOwnTansuNfts);
        setOthersTansuNfts(newOthersTansuNfts);
      }
    );
  };

  const fetchAllShareholders = async (mintPubkey: web3.PublicKey) => {
    // 全権利者を取得
    const tansuAccount = (await fetchAllTansuAccounts(mintPubkey))[0];
    if (!tansuAccount) return [];

    let shareholders = [
      {
        owner: await getNftOwner(mintPubkey),
        useFee: tansuAccount.account.useFee,
      },
    ];

    // Kimono NFTのオーナー情報を追加
    for (const innerTokenPubkey of tansuAccount.account.innerTokens) {
      shareholders = shareholders.concat(await fetchAllShareholders(innerTokenPubkey));
    }
    return shareholders;
  };

  const createDemoEnv = async () => {
    // デモ用にTansu NFTを用意する
    const tansuNftAccount1 = await createTansuNft([], 1);
    const tansuNftAccount2 = await createTansuNft([tansuNftAccount1.tansu.originalToken], 10);
    await createTansuNft([tansuNftAccount2.tansu.originalToken], 100);
    await refreshTansuNftData();
  };

  const testFunc = async () => {
    await refreshTansuNftData();
    // const shareholders = await fetchAllShareholders(ownTansuNfts[0].tansu.originalToken);
    // console.log('shareholders:', shareholders);
    // await fetchTokenMetadata(
    //   generatePubkeyFromBs58('DC4ydm8ey5UB79Jwm8pfDUYqHd33q86N6a1gzy3mdgDi')
    // );
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
