import axios, { AxiosResponse } from 'axios';
import _ from 'lodash';
import { createContext, ReactNode, useCallback, useMemo } from 'react';

import * as mpl from '@metaplex/js';
import * as anchor from '@project-serum/anchor';
import * as spl from '@solana/spl-token';
import { useConnection, useWallet, WalletContextState } from '@solana/wallet-adapter-react';
import * as web3 from '@solana/web3.js';

import idl from './idl.json';
import { TansuNft } from './tansu_nft';
import { Shareholder, TansuNftAccount } from './tansu_nft_types';

const defaultTansuNftAccount: TansuNftAccount = {
  owner: null,
  publicKey: null,
  totalFee: 0,
  tansu: {
    originalToken: null,
    innerTokens: null,
    useFee: null,
  },
  metaplex: {
    name: '',
    imageUri: '',
  },
  shareholders: [],
};

export const SolanaContext = createContext({
  createTansuNft: async (_a: web3.PublicKey[], _b: number, _c: string) => null,
  refreshTansuNftData: async () => ({
    materialTansuNfts: [] as TansuNftAccount[],
    slideTansuNfts: [] as TansuNftAccount[],
  }),
  sendFeeToShareholders: async (_: Shareholder[]) => {},
  testFunc: () => {},
  wallet: null as WalletContextState,
  // getTansuNfts: () => [] as TansuNftAccount[][],
});

export default function SolanaProvider(props: { children: ReactNode }) {
  const { connection } = useConnection();
  const wallet = useWallet();
  const program = useMemo(
    () =>
      new anchor.Program(
        idl as anchor.Idl,
        new web3.PublicKey(idl.metadata.address),
        new anchor.Provider(connection, wallet, anchor.Provider.defaultOptions())
      ) as anchor.Program<TansuNft>,
    [connection, wallet]
  );

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

  const mintNft = async (metadataUri: string): Promise<web3.PublicKey> => {
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
    // const uri = 'https://gateway.pinata.cloud/ipfs/QmNQh8noRHn7e7zt9oYNfGWuxHgKWkNPducMZs1SiZaYw4';

    const { name, symbol, seller_fee_basis_points } = await lookup(metadataUri);

    const metadataDataProps = new mpl.programs.metadata.MetadataDataData({
      name,
      symbol,
      uri: metadataUri,
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

  const fetchTokenMetadata = useCallback(
    async (mintPubkey: web3.PublicKey) => {
      const pda = await mpl.programs.metadata.Metadata.getPDA(mintPubkey);
      const onchainData = (await mpl.programs.metadata.Metadata.load(connection, pda)).data;
      const offchainData = (await axios.get(onchainData.data.uri)).data;
      console.log('onchain data:', onchainData);
      console.log('offchain data:', offchainData);
      return { onchainData, offchainData };
    },
    [connection]
  );

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

  const getNftOwner = useCallback(
    (mintPubkey: web3.PublicKey): Promise<web3.PublicKey> => {
      // mintアドレスから所有者アドレスを特定
      return connection
        .getTokenLargestAccounts(mintPubkey)
        .then(res => {
          // console.log('getTokenLargestAccounts() >', res);
          const tokenAccount = res.value[0].address;
          return connection.getParsedAccountInfo(tokenAccount);
        })
        .then(res => {
          // console.log('getParsedAccountInfo() >', res);
          const data = res.value.data as web3.ParsedAccountData;
          const Base58OwnerPubkey = data.parsed.info.owner as string;
          return generatePubkeyFromBs58(Base58OwnerPubkey);
        })
        .catch(e => {
          console.log('Error:', e);
          return null;
        });
    },
    [connection]
  );

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

  const fetchAllTansuAccounts = useCallback(
    (mintPubkey?: web3.PublicKey) => {
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
    },
    [program]
  );

  const createTansuNft = (
    innerTokenPubkeys: web3.PublicKey[],
    useFee: number,
    metadataUri: string
  ): Promise<TansuNftAccount | null> => {
    // Tansu NFTの作成
    const tansuNftAccount = defaultTansuNftAccount;

    return mintNft(metadataUri)
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
        // setSlideTansuNfts(prev => [...prev, tansuNftAccount]);
        return tansuNftAccount;
      })
      .catch(e => {
        console.log('Error:', e);
        return null;
      });
  };

  const fetchAllShareholders = useCallback(
    async (mintPubkey: web3.PublicKey): Promise<Shareholder[]> => {
      // 全権利者を取得
      const tansuAccount = (await fetchAllTansuAccounts(mintPubkey))[0];
      if (!tansuAccount) return [];

      let shareholders: Shareholder[] = [
        {
          publicKey: await getNftOwner(mintPubkey),
          fee: tansuAccount.account.useFee,
        },
      ];

      // Kimono NFTのオーナー情報を追加
      for (const innerTokenPubkey of tansuAccount.account.innerTokens) {
        shareholders = shareholders.concat(await fetchAllShareholders(innerTokenPubkey));
      }
      return shareholders;
    },
    [fetchAllTansuAccounts, getNftOwner]
  );

  const refreshTansuNftData = useCallback(async () => {
    // Tansu NFTリストを更新
    return fetchAllTansuAccounts().then(async allTansuAccounts => {
      const materialTansuNfts: TansuNftAccount[] = [];
      const slideTansuNfts: TansuNftAccount[] = [];

      // Tansu NFTの振り分け
      for (const tansu of allTansuAccounts) {
        const { onchainData, offchainData } = await fetchTokenMetadata(tansu.account.originalToken);
        const owner = await getNftOwner(tansu.account.originalToken);
        const shareholders = await fetchAllShareholders(tansu.account.originalToken);
        const totalFee = shareholders.reduce((sum, x) => sum + x.fee, 0);

        const tansuNftAccount: TansuNftAccount = {
          owner: owner,
          publicKey: tansu.publicKey,
          totalFee: totalFee,
          tansu: {
            originalToken: tansu.account.originalToken,
            innerTokens: tansu.account.innerTokens,
            useFee: tansu.account.useFee,
          },
          metaplex: {
            name: onchainData.data.name,
            imageUri: offchainData.image,
          },
          shareholders: shareholders,
        };

        if (offchainData.attributes[0]?.value === 'Slide') {
          slideTansuNfts.push(tansuNftAccount);
        } else {
          materialTansuNfts.push(tansuNftAccount);
        }
      }

      // State更新
      // console.log('material Tansu NFT:', materialTansuNfts);
      // console.log('Number of material Tansu NFT:', materialTansuNfts.length);
      // console.log('Number of slide Tansu NFT:', slideTansuNfts.length);
      // setMaterialTansuNfts(newMaterialTansuNfts);
      // setSlideTansuNfts(newSlideTansuNfts);
      return _.cloneDeep({ materialTansuNfts, slideTansuNfts });
    });
  }, [fetchAllTansuAccounts, getNftOwner, fetchTokenMetadata, fetchAllShareholders]);

  const sendFeeToShareholders = async (shareholders: Shareholder[]) => {
    // Transaction作成
    const transaction = new web3.Transaction();
    for (const shareholder of shareholders) {
      transaction.add(
        web3.SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: shareholder.publicKey,
          lamports: shareholder.fee * web3.LAMPORTS_PER_SOL,
        })
      );
    }

    // Transaction実行
    console.log('Sending use fee...');
    const signature = await wallet.sendTransaction(transaction, connection);
    await connection.confirmTransaction(signature, 'processed');
    console.log('Successfully send use fee!');
  };

  const clearAllTansuAccounts = async () => {
    // Tansuアカウント全削除
    await fetchAllTansuAccounts().then(async tansuAccounts => {
      for (const tansuAccount of tansuAccounts) {
        console.log(web3.Keypair.generate().publicKey.toBase58());
        await program.rpc.delete({
          accounts: {
            tansu: tansuAccount.publicKey,
            cleaner: wallet.publicKey,
          },
        });
      }
    });
  };

  const createDemoEnv = async () => {
    // デモ用にTansu NFTを用意する
    await clearAllTansuAccounts();
    const metadataUri = 'https://ipfs.io/ipfs/QmeBqrKS8AcZesRhxw2PKAXG9jAuWo37h8ZCr7hJLCNe95';
    const tansuNftAccount1 = await createTansuNft([], 0.01, metadataUri);
    const metadataUri2 = 'https://ipfs.io/ipfs/Qmd683M7U7chTFkESuaZwBDGyLAsgxxGtRATfJstetmdnn';
    await createTansuNft([tansuNftAccount1.tansu.originalToken], 0.1, metadataUri2);
    // await refreshTansuNftData();

    // const tansuNftAccount1 = await createTansuNft([], 1);
    // const tansuNftAccount2 = await createTansuNft([tansuNftAccount1.tansu.originalToken], 10);
    // await createTansuNft([tansuNftAccount2.tansu.originalToken], 100);
    // await refreshTansuNftData();
  };

  const testFunc = async () => {
    // await createDemoEnv();
    const { materialTansuNfts, slideTansuNfts } = await refreshTansuNftData();
    console.log('materialTansuNfts:', materialTansuNfts);
    console.log('slideTansuNfts:', slideTansuNfts);
  };

  return (
    <SolanaContext.Provider
      value={{
        createTansuNft,
        refreshTansuNftData,
        sendFeeToShareholders,
        testFunc,
        wallet,
      }}
    >
      {props.children}
    </SolanaContext.Provider>
  );
}
