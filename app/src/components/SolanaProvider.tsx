import { createContext, ReactNode } from 'react';

import * as mpl from '@metaplex/js';
import * as spl from '@solana/spl-token';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as web3 from '@solana/web3.js';
import axios, { AxiosResponse } from 'axios';

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


  // get metadata json
  const lookup = async (url: string): Promise<mpl.MetadataJson> => {
    try {
      const { data } = await axios.get<string, AxiosResponse<mpl.MetadataJson>>(url);
  
      return data;
    } catch {
      throw new Error(`unable to get metadata json from url ${url}`);
    }
  };

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
        wallet.publicKey // New authority
      )
    );

    // Transaction実行
    const signature = await wallet.sendTransaction(transaction, connection, { signers: [mint] });
    await connection.confirmTransaction(signature, 'processed');


    // --------create metadata-----------

    const uri = "https://gateway.pinata.cloud/ipfs/QmNQh8noRHn7e7zt9oYNfGWuxHgKWkNPducMZs1SiZaYw4";

    const {
      name,
      symbol,
      seller_fee_basis_points,
      properties: { creators },
    } = await lookup(uri);

    /*
    const creatorsData = creators.reduce<mpl.programs.metadata.Creator[]>((memo, { address, share }) => {
      const verified = address === wallet.publicKey.toString();
  
      const creator = new mpl.programs.metadata.Creator({
        address,
        share,
        verified,
      });
  
      memo = [...memo, creator];
  
      return memo;
    }, []);
    */

    const metadataDataProps = new mpl.programs.metadata.MetadataDataData({
      name,
      symbol,
      uri,
      sellerFeeBasisPoints: seller_fee_basis_points,
      creators: null
    });

    const {txId, metadata} = await createMetadataNFT(mint.publicKey, metadataDataProps, wallet.publicKey);

  };

  const createMetadataNFT = async(editionMint:web3.PublicKey, metadataData:any, updateAuthority:web3.PublicKey)=>{
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
}

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
